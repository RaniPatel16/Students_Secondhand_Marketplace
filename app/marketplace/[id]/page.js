"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MapPin,
  Mail,
  Phone,
  User,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  MessageCircle,
  Share2,
  Sparkles,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { formatPrice, formatDate } from "../../../lib/utils";
import { ProductDetailSkeleton } from "../../../components/LoadingSkeleton";
import ProductCard from "../../../components/ProductCard";
import EnquiryModal from "../../../components/EnquiryModal";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [sellerItemCount, setSellerItemCount] = useState(0);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  // Fetch product data, similar items, and seller listing count
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);

          // Fetch similar products in the same category
          if (data.product.category) {
            const simRes = await fetch(`/api/products?category=${encodeURIComponent(data.product.category)}&limit=4`);
            const simData = await simRes.json();
            if (simData.success && Array.isArray(simData.products)) {
              setSimilarProducts(simData.products.filter((p) => p._id !== id));
            }
          }

          // Fetch other active items listed by this seller
          if (data.product.sellerEmail) {
            const sellerRes = await fetch(`/api/products?sellerEmail=${encodeURIComponent(data.product.sellerEmail)}`);
            const sellerData = await sellerRes.json();
            if (sellerData.success && Array.isArray(sellerData.products)) {
              const otherItems = sellerData.products.filter((p) => p._id !== id);
              setSellerItemCount(otherItems.length);
            }
          }
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    async function checkFavorite() {
      try {
        const userEmail = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
        const res = await fetch(`/api/favorites?userEmail=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.favorites)) {
          const match = data.favorites.some((fav) => (fav.productId?._id || fav.productId) === id);
          setIsFavorite(match);
        }
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    }

    if (id) {
      loadProduct();
      checkFavorite();
    }
  }, [id]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    const userEmail = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
    setFavLoading(true);

    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${id}?userEmail=${encodeURIComponent(userEmail)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsFavorite(false);
          toast.success("Removed from favorites");
        }
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, userEmail }),
        });
        if (res.ok) {
          setIsFavorite(true);
          toast.success("Added to your favorites!");
        }
      }
    } catch (err) {
      toast.error("Could not update favorites");
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-brand-accent" />
        </div>
        <h2 className="text-2xl font-bold text-brand-primary">Listing Not Found</h2>
        <p className="text-sm text-brand-textMuted">
          This product might have been deleted, sold, or is temporarily unavailable.
        </p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"];

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textMuted hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-brand-surface border border-brand-border shadow-sm">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.status && product.status !== "Available" && (
              <div className="absolute top-4 left-4">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow ${
                    product.status === "Sold" ? "bg-red-600" : "bg-amber-600"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? "border-brand-accent shadow-sm scale-105"
                      : "border-brand-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-accentLight text-brand-primary border border-brand-accent/30">
                {product.condition}
              </span>
              {product.listingType && (
                <span className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
                  {product.listingType}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-textMain leading-tight">
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-brand-primary">
                {product.price === 0 ? "Free" : formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-brand-textMuted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Description
            </h3>
            <p className="text-xs sm:text-sm text-brand-textMain leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEnquiryModalOpen(true)}
              className="flex-1 min-w-[200px] py-3.5 px-6 rounded-2xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-brand-accent" />
              <span>Contact Seller / Make Offer</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-2 text-sm font-medium ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-brand-surface border-brand-border text-brand-textMain hover:border-brand-accent"
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-brand-textMuted"}`} />
              <span className="hidden sm:inline">{isFavorite ? "Saved" : "Save"}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3.5 rounded-2xl border border-brand-border bg-brand-surface text-brand-textMain hover:border-brand-accent transition-all"
              title="Share listing link"
            >
              <Share2 className="w-5 h-5 text-brand-textMuted" />
            </button>
          </div>

          {/* Seller Information Card */}
          <div className="p-6 rounded-3xl bg-brand-surface border border-brand-border shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                  {product.sellerName ? product.sellerName.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <h4 className="font-bold text-base text-brand-primary">{product.sellerName}</h4>
                  <span className="text-xs text-brand-textMuted">Campus Student Seller</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Student</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-brand-textMain">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Campus Location: <strong>{product.location}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Email: <a href={`mailto:${product.sellerEmail}`} className="text-brand-primary underline">{product.sellerEmail}</a></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-accent shrink-0" />
                <span>Contact Phone: <a href={`tel:${product.sellerPhone}`} className="text-brand-primary font-semibold">{product.sellerPhone}</a></span>
              </div>
              <div className="flex items-center gap-2 text-brand-textMuted pt-1">
                <Calendar className="w-4 h-4 text-brand-textMuted shrink-0" />
                <span>Listed: {formatDate(product.createdAt)}</span>
              </div>
            </div>

            {/* View All Listings by this Seller Button */}
            <div className="pt-3 border-t border-brand-border">
              <Link
                href={`/marketplace?sellerEmail=${encodeURIComponent(product.sellerEmail)}&sellerName=${encodeURIComponent(product.sellerName)}`}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-primary/5 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-border hover:border-brand-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all group"
              >
                <span>
                  {sellerItemCount > 0
                    ? `Browse ${sellerItemCount} other item${sellerItemCount > 1 ? "s" : ""} by this seller`
                    : `View all listings by ${product.sellerName}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="pt-10 border-t border-brand-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-primary">
                Similar Campus Listings
              </h2>
              <p className="text-xs text-brand-textMuted mt-0.5">
                More {product.category} available on campus
              </p>
            </div>
            <Link
              href={`/marketplace?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-brand-accent hover:text-brand-accentHover flex items-center gap-1"
            >
              <span>View all in {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Enquiry Contact Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
}
