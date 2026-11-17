"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  Tag,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from "lucide-react";
import { formatPrice, formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export default function MyListingsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("rani.patel@campus.edu");
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch products listed by this seller
  const loadMyProducts = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?sellerEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
    setCurrentEmail(saved);
    loadMyProducts(saved);

    const handleUserChanged = () => {
      const updated = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
      setCurrentEmail(updated);
      loadMyProducts(updated);
    };

    window.addEventListener("campusmart_user_changed", handleUserChanged);
    return () => window.removeEventListener("campusmart_user_changed", handleUserChanged);
  }, []);

  // Update product status (Available, Reserved, Sold)
  const handleStatusChange = async (productId, newStatus) => {
    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, status: newStatus } : p))
        );
        toast.success(`Status updated to "${newStatus}"`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle active/inactive
  const handleToggleActive = async (productId, currentActive) => {
    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, isActive: !currentActive } : p))
        );
        toast.success(currentActive ? "Listing hidden from public" : "Listing activated!");
      }
    } catch (err) {
      toast.error("Error updating listing visibility");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this listing permanently?")) return;

    setActionLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Listing deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete listing");
      }
    } catch (err) {
      toast.error("Error deleting listing");
    } finally {
      setActionLoading(null);
    }
  };

  const totalListings = products.length;
  const activeListings = products.filter((p) => p.isActive && p.status === "Available").length;
  const soldListings = products.filter((p) => p.status === "Sold").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5 text-brand-accent" />
            <span>Seller Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-primary">My Product Listings</h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Manage your ads, update prices, mark items sold, or track buyer status.
          </p>
        </div>

        <Link
          href="/sell"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white text-sm font-semibold hover:bg-brand-accentHover transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border">
          <div className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Total Listings</div>
          <div className="text-2xl font-black text-brand-primary mt-1">{totalListings}</div>
        </div>
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border">
          <div className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Active for Sale</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeListings}</div>
        </div>
        <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border">
          <div className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Completed / Sold</div>
          <div className="text-2xl font-black text-brand-accent mt-1">{soldListings}</div>
        </div>
      </div>

      {/* Listings Table / Cards */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-brand-surface rounded-2xl border border-brand-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-brand-accent" />
          </div>
          <h2 className="text-xl font-bold text-brand-primary">No listings created yet</h2>
          <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
            You haven't listed any items for sale under profile <strong>{currentEmail}</strong>.
          </p>
          <div className="pt-2">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primaryHover transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-brand-accent" />
              <span>List an Item Now</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl bg-brand-surface border transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !item.isActive ? "opacity-60 bg-gray-50 border-dashed border-gray-300" : "border-brand-border hover:border-brand-accent/50"
              }`}
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-canvas shrink-0 border border-brand-border">
                  <img
                    src={
                      item.images?.[0] ||
                      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.status === "Available"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "Reserved"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                    {!item.isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700 uppercase">
                        Draft / Hidden
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-brand-textMain hover:text-brand-primary">
                    <Link href={`/marketplace/${item._id}`}>{item.name}</Link>
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-brand-textMuted">
                    <span className="font-extrabold text-brand-primary text-sm">
                      {item.price === 0 ? "Free" : formatPrice(item.price)}
                    </span>
                    <span>•</span>
                    <span>Listed {formatDate(item.createdAt)}</span>
                    <span>•</span>
                    <span>{item.condition}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-brand-border">
                {/* Status Dropdown */}
                <select
                  value={item.status}
                  disabled={actionLoading === item._id}
                  onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-brand-border bg-brand-canvas text-brand-textMain focus:outline-none focus:border-brand-primary"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>

                {/* Active Toggle */}
                <button
                  onClick={() => handleToggleActive(item._id, item.isActive)}
                  disabled={actionLoading === item._id}
                  className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors ${
                    item.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title={item.isActive ? "Hide from marketplace" : "Publish to marketplace"}
                >
                  {item.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span className="hidden sm:inline">{item.isActive ? "Active" : "Hidden"}</span>
                </button>

                {/* View on Marketplace */}
                <Link
                  href={`/marketplace/${item._id}`}
                  className="p-2 rounded-xl border border-brand-border hover:bg-brand-canvas text-brand-textMuted hover:text-brand-primary transition-colors"
                  title="View listing"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Edit */}
                <Link
                  href={`/marketplace/${item._id}/edit`}
                  className="p-2 rounded-xl border border-brand-border hover:bg-brand-canvas text-brand-primary transition-colors"
                  title="Edit listing"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={actionLoading === item._id}
                  className="p-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
