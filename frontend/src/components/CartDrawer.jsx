import React, { useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  Truck,
} from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  onOpenCheckout,
}) {
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = discountedSubtotal * 0.08;
  const isFreeDelivery = discountedSubtotal >= 35 || cart.length === 0;
  const deliveryFee = cart.length === 0 ? 0 : isFreeDelivery ? 0 : 2.99;
  const grandTotal = discountedSubtotal + tax + deliveryFee;

  const amountNeededForFreeDelivery = Math.max(0, 35 - discountedSubtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "FEAST20") {
      setDiscountPercent(20);
      setAppliedCode("FEAST20");
      setCouponError("");
    } else if (code === "WELCOME10") {
      setDiscountPercent(10);
      setAppliedCode("WELCOME10");
      setCouponError("");
    } else {
      setCouponError("Invalid code. Try FEAST20 or WELCOME10");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setAppliedCode("");
    setCouponCode("");
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} color="var(--primary)" />
            <h2>Your Cart</h2>
            <span className="drawer-items-count">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free delivery tier progress */}
        {cart.length > 0 && (
          <div className="delivery-tier-banner">
            <Truck size={18} color={isFreeDelivery ? "#16a34a" : "var(--primary)"} />
            {isFreeDelivery ? (
              <span className="tier-text free">
                🎉 Congratulations! You have unlocked <b>FREE Delivery</b>!
              </span>
            ) : (
              <span className="tier-text">
                Add <b>${amountNeededForFreeDelivery.toFixed(2)}</b> more for <b>FREE delivery</b>
              </span>
            )}
          </div>
        )}

        {/* Cart items list or empty state */}
        <div className="drawer-content">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Explore delicious dishes from our menu and fill up your cart.</p>
              <button className="btn-primary" onClick={onClose}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit-price">
                      ${parseFloat(item.price).toFixed(2)} each
                    </span>

                    <div className="cart-item-controls">
                      <div className="qty-picker mini">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        className="btn-trash-item"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove dish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout button */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo code form */}
            {!appliedCode ? (
              <form onSubmit={handleApplyCoupon} className="coupon-form">
                <Tag size={16} className="coupon-icon" />
                <input
                  type="text"
                  placeholder="Promo code (e.g. FEAST20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button type="submit" className="coupon-apply-btn">
                  Apply
                </button>
              </form>
            ) : (
              <div className="coupon-applied-badge">
                <div className="badge-text">
                  <Check size={15} color="#16a34a" />
                  <span>Promo <b>{appliedCode}</b> ({discountPercent}% OFF) applied!</span>
                </div>
                <button
                  type="button"
                  className="remove-coupon-btn"
                  onClick={handleRemoveCoupon}
                >
                  Remove
                </button>
              </div>
            )}
            {couponError && <p className="coupon-error-msg">{couponError}</p>}

            {/* Bill breakdown */}
            <div className="bill-summary">
              <div className="bill-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="bill-row discount">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="bill-row">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>
                  {isFreeDelivery ? (
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="bill-row total-row">
                <span>Grand Total</span>
                <span className="total-val">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="btn-checkout-primary"
              onClick={() => {
                onClose();
                onOpenCheckout({
                  subtotal,
                  discountAmount,
                  tax,
                  deliveryFee,
                  grandTotal,
                  appliedCode,
                });
              }}
            >
              <span>Proceed to Checkout</span>
              <div className="checkout-btn-price">
                <span>${grandTotal.toFixed(2)}</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
