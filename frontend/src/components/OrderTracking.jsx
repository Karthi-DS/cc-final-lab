import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  XCircle,
  Search,
  Package,
  MapPin,
  Phone,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: Clock },
  { key: "Preparing", label: "In Kitchen", icon: ChefHat },
  { key: "Out for Delivery", label: "On The Way", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderTracking({
  orders,
  refreshOrders,
  api,
  showToast,
  highlightedOrderId,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshOrders();
    setIsRefreshing(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancellingId(orderId);
      await api.updateOrderStatus(orderId, "Cancelled");
      showToast({ type: "info", message: "Order has been cancelled." });
      await refreshOrders();
    } catch (err) {
      showToast({ type: "error", message: err.message || "Failed to cancel order" });
    } finally {
      setCancellingId(null);
    }
  };

  const getStepStatus = (currentStatus, stepKey) => {
    if (currentStatus === "Cancelled") return "cancelled";
    const orderMap = {
      Pending: 0,
      Confirmed: 0,
      Preparing: 1,
      "Out for Delivery": 2,
      Delivered: 3,
    };
    const currentIdx = orderMap[currentStatus] ?? 0;
    const stepIdx = orderMap[stepKey] ?? 0;

    if (currentIdx > stepIdx) return "completed";
    if (currentIdx === stepIdx) return "active";
    return "pending";
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(term) ||
      o.customerName?.toLowerCase().includes(term) ||
      o.customerPhone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="order-tracking-wrapper">
      <div className="tracking-header">
        <div>
          <h1 className="page-title">Track Your Orders</h1>
          <p className="page-subtitle">
            Follow the live status of your order from our kitchen to your doorstep
          </p>
        </div>

        <div className="tracking-actions-bar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by Order # or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="btn-refresh"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh Orders"
          >
            <RefreshCw size={16} className={isRefreshing ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders-state">
          <Package size={48} color="#94a3b8" />
          <h3>No orders found</h3>
          <p>
            {searchTerm
              ? "No orders match your search term. Try another order ID or phone number."
              : "You haven't placed any orders yet. Head back to the menu and order some tasty meals!"}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const isHighlighted = order.id === highlightedOrderId;
            const isCancelled = order.orderStatus === "Cancelled";
            const items = Array.isArray(order.items)
              ? order.items
              : typeof order.items === "string"
              ? JSON.parse(order.items)
              : [];

            return (
              <div
                key={order.id}
                className={`order-card ${isHighlighted ? "highlighted" : ""} ${
                  isCancelled ? "cancelled" : ""
                }`}
              >
                {/* Top Bar: Order number & timestamp */}
                <div className="order-top-bar">
                  <div className="order-id-group">
                    <span className="order-number">{order.orderNumber}</span>
                    <span className="order-time">
                      {new Date(order.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="order-status-pill-wrap">
                    <span
                      className={`status-pill status-${order.orderStatus
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper (unless cancelled) */}
                {!isCancelled ? (
                  <div className="stepper-container">
                    <div className="stepper-track">
                      {STATUS_STEPS.map((step, idx) => {
                        const status = getStepStatus(order.orderStatus, step.key);
                        const Icon = step.icon;
                        return (
                          <div
                            key={step.key}
                            className={`stepper-step ${status}`}
                          >
                            <div className="step-circle">
                              <Icon size={16} />
                            </div>
                            <span className="step-title">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="cancelled-banner">
                    <XCircle size={18} color="#ef4444" />
                    <span>This order has been cancelled.</span>
                  </div>
                )}

                {/* Content: Items list & Delivery address */}
                <div className="order-details-grid">
                  <div className="order-items-column">
                    <h4>Ordered Items ({items.length})</h4>
                    <div className="items-list-compact">
                      {items.map((item, idx) => (
                        <div key={idx} className="item-compact-row">
                          <img
                            src={
                              item.imageUrl ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"
                            }
                            alt={item.name}
                            className="item-compact-thumb"
                          />
                          <div className="item-compact-info">
                            <span className="item-compact-name">{item.name}</span>
                            <span className="item-compact-qty">
                              Qty: <b>{item.quantity}</b> × $
                              {parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                          <span className="item-compact-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-meta-column">
                    <div className="info-block">
                      <span className="info-label">
                        <MapPin size={14} /> Delivery Address
                      </span>
                      <p className="info-text">{order.deliveryAddress}</p>
                    </div>

                    <div className="info-block">
                      <span className="info-label">
                        <Phone size={14} /> Recipient
                      </span>
                      <p className="info-text">
                        {order.customerName} ({order.customerPhone})
                      </p>
                    </div>

                    {order.specialInstructions && (
                      <div className="info-block">
                        <span className="info-label">Notes</span>
                        <p className="info-text italic">
                          "{order.specialInstructions}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Bar: Total amount & Actions */}
                <div className="order-bottom-bar">
                  <div className="pay-summary">
                    <span className="pay-mode">
                      Paid via <b>{order.paymentMethod}</b>
                    </span>
                    <span className="order-grand-total">
                      Total: <b>${parseFloat(order.totalAmount).toFixed(2)}</b>
                    </span>
                  </div>

                  {/* Cancel button if order is still Pending */}
                  {order.orderStatus === "Pending" && (
                    <button
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
