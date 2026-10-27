import React, { useState } from "react";
import {
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Search,
  Filter,
  Trash2,
  Edit,
  Phone,
  MapPin,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const STATUSES = [
  "All",
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const NEXT_STATUS = {
  Pending: "Preparing",
  Confirmed: "Preparing",
  Preparing: "Out for Delivery",
  "Out for Delivery": "Delivered",
};

export default function AdminOrdersManager({
  orders,
  refreshOrders,
  api,
  showToast,
}) {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Edit Customer / Delivery Modal state
  const [editOrderModal, setEditOrderModal] = useState(null);
  const [editForm, setEditForm] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    specialInstructions: "",
    paymentMethod: "Cash on Delivery",
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setIsRefreshing(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await api.updateOrderStatus(orderId, newStatus);
      showToast({
        type: "success",
        message: `Order status changed to "${newStatus}"!`,
      });
      await refreshOrders();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to update status." });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAdvanceStatus = async (order) => {
    const next = NEXT_STATUS[order.orderStatus];
    if (!next) return;
    await handleStatusChange(order.id, next);
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Permanently delete order ${order.orderNumber}?`)) return;
    try {
      setDeletingId(order.id);
      await api.deleteOrder(order.id);
      showToast({ type: "info", message: `Order ${order.orderNumber} deleted.` });
      await refreshOrders();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to delete order." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEdit = (order) => {
    setEditOrderModal(order);
    setEditForm({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      specialInstructions: order.specialInstructions || "",
      paymentMethod: order.paymentMethod,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editOrderModal) return;

    try {
      await api.updateOrder(editOrderModal.id, editForm);
      showToast({
        type: "success",
        message: `Order ${editOrderModal.orderNumber} updated successfully!`,
      });
      setEditOrderModal(null);
      await refreshOrders();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to update order details." });
    }
  };

  // KPI calculations
  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

  const pendingCount = orders.filter((o) => o.orderStatus === "Pending").length;
  const preparingCount = orders.filter((o) => o.orderStatus === "Preparing").length;
  const deliveryCount = orders.filter((o) => o.orderStatus === "Out for Delivery").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "Delivered").length;

  const filtered = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === "All" || o.orderStatus === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.toLowerCase().includes(q) ||
      o.deliveryAddress?.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="admin-orders-wrapper">
      {/* KPI Cards Bar */}
      <div className="orders-kpis-grid">
        <div className="kpi-card revenue">
          <div className="kpi-icon-wrap">
            <DollarSign size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val">${totalRevenue.toFixed(2)}</span>
            <span className="kpi-label">Total Revenue</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ backgroundColor: "#fffbeb", color: "#d97706" }}>
            <Clock size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val">{pendingCount}</span>
            <span className="kpi-label">Pending Confirmation</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
            <Package size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val">{preparingCount}</span>
            <span className="kpi-label">Cooking in Kitchen</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
            <Truck size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val">{deliveryCount}</span>
            <span className="kpi-label">Out for Delivery</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" style={{ backgroundColor: "#ecfdf5", color: "#16a34a" }}>
            <CheckCircle size={20} />
          </div>
          <div className="kpi-info">
            <span className="kpi-val">{deliveredCount}</span>
            <span className="kpi-label">Delivered Successfully</span>
          </div>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="admin-orders-header">
        <div>
          <h2>Customer Orders Management</h2>
          <p>Monitor incoming food orders, update preparation stages, and manage delivery</p>
        </div>

        <button
          className="btn-refresh"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={isRefreshing ? "spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="orders-toolbar">
        {/* Status Pills */}
        <div className="status-tabs">
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`status-tab-btn ${selectedStatus === status ? "active" : ""}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="orders-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer, phone, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Grid / Cards */}
      {filtered.length === 0 ? (
        <div className="empty-orders-state">
          <Package size={48} color="#94a3b8" />
          <h3>No customer orders found</h3>
          <p>There are no orders matching your selected status or filter.</p>
        </div>
      ) : (
        <div className="admin-orders-cards-list">
          {filtered.map((order) => {
            const items = Array.isArray(order.items)
              ? order.items
              : typeof order.items === "string"
              ? JSON.parse(order.items)
              : [];

            const nextStep = NEXT_STATUS[order.orderStatus];

            return (
              <div
                key={order.id}
                className={`admin-order-card status-${order.orderStatus
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {/* Header row */}
                <div className="a-order-header">
                  <div className="a-order-id-group">
                    <span className="a-order-num">{order.orderNumber}</span>
                    <span className="a-order-date">
                      {new Date(order.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Status selector dropdown */}
                  <div className="a-order-status-control">
                    <select
                      className={`status-select status-${order.orderStatus
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {nextStep && (
                      <button
                        className="btn-advance-status"
                        onClick={() => handleAdvanceStatus(order)}
                        title={`Advance to ${nextStep}`}
                        disabled={updatingId === order.id}
                      >
                        <span>{nextStep}</span>
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body: Customer info & Items list */}
                <div className="a-order-body">
                  <div className="a-customer-info-box">
                    <div className="info-row">
                      <span className="label">Customer:</span>
                      <span className="val bold">{order.customerName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">
                        <Phone size={13} /> Phone:
                      </span>
                      <span className="val">{order.customerPhone}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">
                        <MapPin size={13} /> Address:
                      </span>
                      <span className="val">{order.deliveryAddress}</span>
                    </div>
                    {order.specialInstructions && (
                      <div className="info-row notes">
                        <span className="label">Note:</span>
                        <span className="val italic">"{order.specialInstructions}"</span>
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="a-items-box">
                    <span className="items-header">Ordered Items ({items.length}):</span>
                    <div className="a-items-scroll">
                      {items.map((it, idx) => (
                        <div key={idx} className="a-item-pill">
                          <span className="qty">{it.quantity}×</span>
                          <span className="name">{it.name}</span>
                          <span className="price">
                            ${(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Payment & Actions */}
                <div className="a-order-footer">
                  <div className="a-order-pricing">
                    <span className="pay-method">
                      Method: <b>{order.paymentMethod}</b>
                    </span>
                    <span className="amount-total">
                      Total: <b>${parseFloat(order.totalAmount).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="a-actions-group">
                    <button
                      className="btn-mini-action"
                      onClick={() => handleOpenEdit(order)}
                      title="Edit Customer Details"
                    >
                      <Edit size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="btn-mini-action delete"
                      onClick={() => handleDeleteOrder(order)}
                      disabled={deletingId === order.id}
                      title="Delete Order"
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Order Modal */}
      {editOrderModal && (
        <div className="modal-backdrop" onClick={() => setEditOrderModal(null)}>
          <div
            className="dish-form-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "520px" }}
          >
            <div className="modal-header-standard">
              <div>
                <h2>Edit Order {editOrderModal.orderNumber}</h2>
                <p className="modal-sub">Update customer details or delivery notes</p>
              </div>
              <button
                className="modal-close-round"
                onClick={() => setEditOrderModal(null)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="dish-modal-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={editForm.customerName}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, customerName: e.target.value }))
                  }
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Customer Phone</label>
                <input
                  type="text"
                  value={editForm.customerPhone}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, customerPhone: e.target.value }))
                  }
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  rows={2}
                  value={editForm.deliveryAddress}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, deliveryAddress: e.target.value }))
                  }
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Special Instructions</label>
                <input
                  type="text"
                  value={editForm.specialInstructions}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      specialInstructions: e.target.value,
                    }))
                  }
                  className="form-input"
                />
              </div>

              <div className="modal-buttons-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditOrderModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
