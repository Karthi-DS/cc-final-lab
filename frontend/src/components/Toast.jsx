import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        borderRadius: "var(--radius-md)",
        backgroundColor: "#ffffff",
        color: "#0f172a",
        boxShadow: "var(--shadow-xl)",
        border: `1px solid ${
          isSuccess ? "#bbf7d0" : isError ? "#fecaca" : "#bfdbfe"
        }`,
        maxWidth: "420px",
        animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        style={{
          color: isSuccess ? "#16a34a" : isError ? "#dc2626" : "#2563eb",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isSuccess ? (
          <CheckCircle2 size={22} />
        ) : isError ? (
          <AlertCircle size={22} />
        ) : (
          <Info size={22} />
        )}
      </div>
      <div style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>
        {toast.message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#94a3b8",
          padding: "4px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
