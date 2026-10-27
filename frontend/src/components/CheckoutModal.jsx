import React, { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, CheckCircle, ShieldAlert } from "lucide-react";

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  orderTotals,
  onOrderSuccess,
  api,
  showToast,
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    paymentMethod: "Cash on Delivery",
    specialInstructions: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.customerName.trim()) {
      setError("Please provide your full name");
      return;
    }
    if (!formData.customerPhone.trim()) {
      setError("Please provide your phone number");
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setError("Please provide your delivery address");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions.trim(),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
      };

      const createdOrder = await api.createOrder(payload);
      showToast({
        type: "success",
        message: `Order #${createdOrder.orderNumber} placed successfully!`,
      });
      onOrderSuccess(createdOrder);
      onClose();
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <h2>Checkout & Delivery Details</h2>
            <p className="checkout-subtitle">Enter your contact and address to finalize your order</p>
          </div>
          <button className="modal-close-round" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="form-error-alert">
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="customerName"
                placeholder="e.g. Eleanor Vance"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="customerPhone"
                placeholder="e.g. +1 (555) 019-2834"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address (Optional)</label>
            <input
              type="email"
              name="customerEmail"
              placeholder="e.g. eleanor.v@example.com"
              value={formData.customerEmail}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Delivery Address *</label>
            <textarea
              name="deliveryAddress"
              rows={2}
              placeholder="House/Apt No., Building Name, Street & Landmark"
              value={formData.deliveryAddress}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Special Cooking / Delivery Instructions</label>
            <input
              type="text"
              name="specialInstructions"
              placeholder="e.g. Extra napkins, leave by the door, ring bell"
              value={formData.specialInstructions}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Payment Method selector */}
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options-grid">
              <label
                className={`payment-option-card ${
                  formData.paymentMethod === "Cash on Delivery" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === "Cash on Delivery"}
                  onChange={handleChange}
                />
                <Banknote size={20} className="pay-icon" />
                <div className="pay-text">
                  <strong>Cash on Delivery</strong>
                  <span>Pay upon receiving food</span>
                </div>
              </label>

              <label
                className={`payment-option-card ${
                  formData.paymentMethod === "Credit Card" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={formData.paymentMethod === "Credit Card"}
                  onChange={handleChange}
                />
                <CreditCard size={20} className="pay-icon" />
                <div className="pay-text">
                  <strong>Credit / Debit Card</strong>
                  <span>Visa, Mastercard, Amex</span>
                </div>
              </label>

              <label
                className={`payment-option-card ${
                  formData.paymentMethod === "UPI / Instant Pay" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI / Instant Pay"
                  checked={formData.paymentMethod === "UPI / Instant Pay"}
                  onChange={handleChange}
                />
                <Smartphone size={20} className="pay-icon" />
                <div className="pay-text">
                  <strong>UPI / Online Pay</strong>
                  <span>Google Pay, PhonePe, QR</span>
                </div>
              </label>
            </div>
          </div>

          {/* Mini Items Review */}
          <div className="checkout-items-preview">
            <span className="preview-label">Ordering {cart.length} dish types:</span>
            <div className="chips-row">
              {cart.map((item) => (
                <span key={item.id} className="item-chip">
                  {item.name} × <b>{item.quantity}</b>
                </span>
              ))}
            </div>
          </div>

          <div className="checkout-footer-action">
            <div className="checkout-price-total">
              <span className="label">Total to Pay:</span>
              <span className="total">
                ${(orderTotals?.grandTotal || 0).toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary confirm-order-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Placing Your Order...</span>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
