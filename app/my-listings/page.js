"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Tag,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  MessageSquare,
  Mail,
  DollarSign,
  Send,
  Phone,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { formatPrice, formatDate } from "../../lib/utils";
import toast from "react-hot-toast";

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState("listings"); // 'listings' | 'enquiries' | 'sentOffers'
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [sentOffersLoading, setSentOffersLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("rani.patel@campus.edu");
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch products listed by this seller
  const loadMyProducts = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?sellerEmail=${encodeURIComponent(email)}&includeDrafts=true`);
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

  // Fetch enquiries for seller's products
  const loadMyEnquiries = async (email) => {
    setEnquiriesLoading(true);
    try {
      const res = await fetch(`/api/enquiries?sellerEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      toast.error("Failed to load enquiries");
    } finally {
      setEnquiriesLoading(false);
    }
  };

  // Fetch enquiries/offers sent by this student as a buyer
  const loadSentOffers = async (email) => {
    setSentOffersLoading(true);
    try {
      const res = await fetch(`/api/enquiries?buyerEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setSentOffers(data.enquiries);
      }
    } catch (err) {
      toast.error("Failed to load sent offers");
    } finally {
      setSentOffersLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
    setCurrentEmail(saved);
    loadMyProducts(saved);
    loadMyEnquiries(saved);
    loadSentOffers(saved);

    const handleUserChanged = () => {
      const updated = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
      setCurrentEmail(updated);
      loadMyProducts(updated);
      loadMyEnquiries(updated);
      loadSentOffers(updated);
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

  // Update enquiry status (Accepted, Rejected)
  const handleEnquiryStatus = async (enquiryId, status) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) =>
          prev.map((item) => (item._id === enquiryId ? { ...item, status } : item))
        );
        toast.success(`Offer ${status.toLowerCase()}!`);
      } else {
        toast.error("Failed to update offer status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  // Delete / withdraw a sent offer as buyer
  const handleDeleteSentOffer = async (enquiryId) => {
    if (!confirm("Are you sure you want to withdraw this offer?")) return;
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSentOffers((prev) => prev.filter((item) => item._id !== enquiryId));
        toast.success("Offer withdrawn");
      } else {
        toast.error("Failed to withdraw offer");
      }
    } catch (err) {
      toast.error("Error withdrawing offer");
    }
  };

  const totalListings = products.length;
  const activeListings = products.filter((p) => p.isActive && p.status === "Available").length;
  const pendingEnquiries = enquiries.filter((e) => e.status === "Pending").length;
  const acceptedSentOffers = sentOffers.filter((e) => e.status === "Accepted").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5 text-brand-accent" />
            <span>Dashboard & Enquiries</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-primary">Student Dashboard</h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Manage your ads, respond to incoming buyer enquiries, and track offers you sent to sellers.
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

      {/* Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-brand-border">
        <button
          onClick={() => setActiveTab("listings")}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "listings"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-brand-textMuted hover:text-brand-primary"
          }`}
        >
          <Package className="w-4 h-4 text-brand-accent" />
          <span>My Listings ({totalListings})</span>
        </button>

        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all relative ${
            activeTab === "enquiries"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-brand-textMuted hover:text-brand-primary"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-brand-accent" />
          <span>Received Offers ({enquiries.length})</span>
          {pendingEnquiries > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-accent text-white">
              {pendingEnquiries}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("sentOffers")}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all relative ${
            activeTab === "sentOffers"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-brand-textMuted hover:text-brand-primary"
          }`}
        >
          <Send className="w-4 h-4 text-brand-accent" />
          <span>My Sent Offers ({sentOffers.length})</span>
          {acceptedSentOffers > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
              {acceptedSentOffers} Accepted!
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: LISTINGS VIEW */}
      {activeTab === "listings" && (
        <div className="space-y-6">
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
              <div className="text-xs font-bold text-brand-textMuted uppercase tracking-wider">Pending Enquiries</div>
              <div className="text-2xl font-black text-brand-accent mt-1">{pendingEnquiries}</div>
            </div>
          </div>

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

                    {/* View */}
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
      )}

      {/* TAB 2: ENQUIRIES & OFFERS VIEW */}
      {activeTab === "enquiries" && (
        <div className="space-y-4">
          {enquiriesLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-brand-surface rounded-2xl border border-brand-border" />
              ))}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
                <MessageSquare className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-xl font-bold text-brand-primary">No enquiries yet</h2>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                When fellow students send messages or negotiate counter offers on your listings, they will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => {
                const product = enq.productId;
                return (
                  <div
                    key={enq._id}
                    className="p-5 rounded-2xl bg-brand-surface border border-brand-border shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                          {enq.buyerName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-brand-primary">{enq.buyerName}</div>
                          <div className="text-xs text-brand-textMuted flex items-center gap-1">
                            <Mail className="w-3 h-3 text-brand-accent" />
                            <a href={`mailto:${enq.buyerEmail}`} className="underline">
                              {enq.buyerEmail}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            enq.status === "Accepted"
                              ? "bg-emerald-100 text-emerald-800"
                              : enq.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {enq.status}
                        </span>
                        <span className="text-[11px] text-brand-textMuted">{formatDate(enq.createdAt)}</span>
                      </div>
                    </div>

                    {/* Product & Offer details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-brand-canvas p-3 rounded-xl">
                      <div>
                        <span className="text-brand-textMuted font-medium">Product Inquired: </span>
                        {product ? (
                          <Link href={`/marketplace/${product._id}`} className="font-bold text-brand-primary hover:underline">
                            {product.name}
                          </Link>
                        ) : (
                          <span className="text-brand-textMuted italic">[Deleted Product]</span>
                        )}
                      </div>

                      {enq.offerPrice && (
                        <div>
                          <span className="text-brand-textMuted font-medium">Counter Offer: </span>
                          <span className="font-black text-brand-primary text-sm">
                            {formatPrice(enq.offerPrice)}
                          </span>
                          {product && (
                            <span className="text-brand-textMuted text-[10px] ml-1">
                              (Asking: {formatPrice(product.price)})
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="text-xs text-brand-textMain bg-brand-surface p-2.5 rounded-xl border border-brand-border">
                      <span className="font-semibold text-brand-primary block mb-0.5">Buyer Message:</span>
                      <p className="whitespace-pre-line text-brand-textMain/90">{enq.message}</p>
                    </div>

                    {/* Accept / Reject Offer Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {enq.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleEnquiryStatus(enq._id, "Rejected")}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Decline Offer</span>
                          </button>
                          <button
                            onClick={() => handleEnquiryStatus(enq._id, "Accepted")}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept Offer</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnquiryStatus(enq._id, "Pending")}
                          className="text-xs text-brand-textMuted hover:text-brand-primary underline"
                        >
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENT OFFERS AS BUYER VIEW */}
      {activeTab === "sentOffers" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border text-xs text-brand-textMuted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Tracking offers sent from your student profile: <strong>{currentEmail}</strong></span>
            <span className="font-semibold text-brand-primary">Total Sent: {sentOffers.length}</span>
          </div>

          {sentOffersLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-28 bg-brand-surface rounded-2xl border border-brand-border" />
              ))}
            </div>
          ) : sentOffers.length === 0 ? (
            <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
                <Send className="w-8 h-8 text-brand-accent" />
              </div>
              <h2 className="text-xl font-bold text-brand-primary">No sent offers yet</h2>
              <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
                When you find campus products you like and send enquiries or propose counter-offers, their status will appear here.
              </p>
              <div className="pt-2">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primaryHover transition-all shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-accent" />
                  <span>Browse Marketplace Items</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sentOffers.map((item) => {
                const product = item.productId;
                const isAccepted = item.status === "Accepted";
                const isRejected = item.status === "Rejected";
                const isPending = item.status === "Pending";

                return (
                  <div
                    key={item._id}
                    className={`p-5 rounded-2xl bg-brand-surface border transition-all shadow-sm space-y-4 ${
                      isAccepted
                        ? "border-emerald-300 ring-1 ring-emerald-200"
                        : "border-brand-border"
                    }`}
                  >
                    {/* Top Status Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-brand-border">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            isAccepted
                              ? "bg-emerald-100 text-emerald-800"
                              : isRejected
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isAccepted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                          {isRejected && <XCircle className="w-3.5 h-3.5 text-red-700" />}
                          {isPending && <Clock className="w-3.5 h-3.5 text-amber-700" />}
                          <span>{item.status}</span>
                        </span>
                        <span className="text-[11px] text-brand-textMuted">Sent on {formatDate(item.createdAt)}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteSentOffer(item._id)}
                        className="self-end sm:self-center text-xs text-red-600 hover:text-red-800 flex items-center gap-1 hover:underline"
                        title="Withdraw this enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw Offer</span>
                      </button>
                    </div>

                    {/* Accepted Callout Banner */}
                    {isAccepted && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Congratulations! The seller accepted your offer.</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">
                          Reach out to <strong>{product?.sellerName || "the seller"}</strong> directly to coordinate the campus handover:
                        </p>
                        <div className="flex flex-wrap gap-4 pt-1 font-semibold text-[11px]">
                          {product?.sellerPhone && (
                            <a href={`tel:${product.sellerPhone}`} className="flex items-center gap-1 text-emerald-800 underline">
                              <Phone className="w-3 h-3" />
                              <span>{product.sellerPhone}</span>
                            </a>
                          )}
                          {product?.sellerEmail && (
                            <a href={`mailto:${product.sellerEmail}`} className="flex items-center gap-1 text-emerald-800 underline">
                              <Mail className="w-3 h-3" />
                              <span>{product.sellerEmail}</span>
                            </a>
                          )}
                          {product?.location && (
                            <span className="text-emerald-800">📍 {product.location}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Product & Proposed Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-canvas p-3.5 rounded-xl">
                      <div className="flex items-center gap-3">
                        {product?.images?.[0] && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-surface shrink-0 border border-brand-border">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="text-[10px] text-brand-textMuted uppercase font-semibold">Target Product</div>
                          {product ? (
                            <Link href={`/marketplace/${product._id}`} className="font-bold text-sm text-brand-primary hover:underline line-clamp-1">
                              {product.name}
                            </Link>
                          ) : (
                            <span className="text-sm font-semibold text-brand-textMuted italic">[Listing Removed]</span>
                          )}
                          <div className="text-[11px] text-brand-textMuted">
                            Seller: <strong>{product?.sellerName || "Campus Student"}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs shrink-0">
                        {product?.price !== undefined && (
                          <div>
                            <span className="text-brand-textMuted block text-[10px]">Listed Price</span>
                            <span className="font-bold text-brand-textMain">{formatPrice(product.price)}</span>
                          </div>
                        )}
                        {item.offerPrice && (
                          <div className="border-l border-brand-border pl-4">
                            <span className="text-brand-accent block text-[10px] font-bold">Your Offer</span>
                            <span className="font-black text-brand-primary text-base">{formatPrice(item.offerPrice)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buyer Message */}
                    <div className="text-xs text-brand-textMain bg-brand-surface p-2.5 rounded-xl border border-brand-border">
                      <span className="font-semibold text-brand-primary block mb-0.5">Your Sent Message:</span>
                      <p className="whitespace-pre-line text-brand-textMain/90">{item.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
