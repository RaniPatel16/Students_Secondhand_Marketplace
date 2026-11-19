"use client";

import { useState, useEffect } from "react";
import { X, Send, MessageSquare, DollarSign, CheckCircle2, Loader2 } from "lucide-react";
import { formatPrice } from "../lib/utils";
import toast from "react-hot-toast";

// =============================================================================
// EnquiryModal Component
// Interactive modal for prospective student buyers to contact the seller.
// Allows asking questions, requesting meetups, and submitting optional counter-offers.
// =============================================================================

export default function EnquiryModal({ isOpen, onClose, product }) {
  // Form fields
  const [buyerName, setBuyerName] = useState("Rani Patel");
  const [buyerEmail, setBuyerEmail] = useState("rani.patel@campus.edu");
  const [message, setMessage] = useState("Hi! Is this item still available? Can we meet on campus to inspect it?");
  const [offerPrice, setOfferPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill active student profile info from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("campusmart_user_email");
    if (saved) {
      setBuyerEmail(saved);
      setBuyerName(saved.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Handle form submission to POST /api/enquiries
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!buyerName.trim() || !buyerEmail.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          message: message.trim(),
          offerPrice: offerPrice ? Number(offerPrice) : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        toast.success("Enquiry sent to seller!");
      } else {
        toast.error(data.message || "Failed to submit enquiry");
      }
    } catch (err) {
      toast.error("Error submitting message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-brand-surface rounded-3xl border border-brand-border max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border bg-brand-canvas/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-brand-accent" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-primary">Contact Seller</h3>
              <p className="text-[11px] text-brand-textMuted truncate max-w-[260px]">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-textMuted hover:bg-brand-canvas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-brand-primary">Message Delivered!</h4>
            <p className="text-xs text-brand-textMuted max-w-xs mx-auto leading-relaxed">
              The seller ({product.sellerName}) has received your enquiry and offer. They will contact you at <strong>{buyerEmail}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primaryHover"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Item Quick Summary */}
            <div className="p-3 rounded-2xl bg-brand-canvas flex items-center justify-between text-xs">
              <span className="font-medium text-brand-textMuted">Asking Price:</span>
              <span className="font-bold text-brand-primary text-sm">
                {product.price === 0 ? "Free" : formatPrice(product.price)}
              </span>
            </div>

            {/* Buyer Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-canvas text-brand-textMain focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                  Your Campus Email *
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-canvas text-brand-textMain focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Offer Price (Optional) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-brand-primary flex items-center justify-between">
                <span>Offer Price (₹) (Optional)</span>
                <span className="text-[10px] text-brand-textMuted font-normal">Negotiate if desired</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-textMuted text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder={`Suggest a counter offer (e.g. ${Math.round(product.price * 0.9)})`}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-canvas text-brand-textMain focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-brand-primary">
                Message to Seller *
              </label>
              <textarea
                rows="3"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about condition, preferred campus handover location..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-canvas text-brand-textMain focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-brand-border text-xs font-semibold text-brand-textMuted hover:bg-brand-canvas"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primaryHover flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
