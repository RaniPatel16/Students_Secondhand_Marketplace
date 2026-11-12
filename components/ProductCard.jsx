"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Tag, User } from "lucide-react";
import { formatPrice } from "../lib/utils";
import toast from "react-hot-toast";

export default function ProductCard({ product, isFavoriteInitial = false, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);
  const [favLoading, setFavLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
  );

  // Toggle favorite in database
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userEmail = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
    setFavLoading(true);

    try {
      if (isFavorite) {
        // DELETE favorite
        const res = await fetch(`/api/favorites/${product._id}?userEmail=${encodeURIComponent(userEmail)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsFavorite(false);
          toast.success("Removed from favorites");
          if (onFavoriteChange) onFavoriteChange(product._id, false);
        } else {
          toast.error("Failed to remove favorite");
        }
      } else {
        // POST favorite
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            userEmail,
          }),
        });
        if (res.ok) {
          setIsFavorite(true);
          toast.success("Saved to favorites!");
          if (onFavoriteChange) onFavoriteChange(product._id, true);
        } else {
          toast.error("Could not save to favorites");
        }
      }
    } catch (err) {
      toast.error("Error updating favorite");
    } finally {
      setFavLoading(false);
    }
  };

  // Condition color mapping
  const conditionColors = {
    New: "bg-emerald-50 text-emerald-800 border-emerald-200",
    "Like New": "bg-blue-50 text-blue-800 border-blue-200",
    Good: "bg-amber-50 text-amber-800 border-amber-200",
    Fair: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Discount percentage
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-accent/50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-canvas">
        <Link href={`/marketplace/${product._id}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80")}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Status Overlay if Sold or Reserved */}
        {product.status && product.status !== "Available" && (
          <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-[2px] flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
                product.status === "Sold" ? "bg-red-600" : "bg-amber-600"
              }`}
            >
              {product.status}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={favLoading}
          aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
          className="absolute top-3 right-3 p-2 rounded-full bg-brand-surface/90 hover:bg-brand-surface text-brand-primary shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-brand-textMuted hover:text-brand-primary"
            }`}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-surface/95 text-brand-primary shadow-sm border border-brand-border">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Condition and Listing Type */}
          <div className="flex items-center justify-between text-[11px]">
            <span
              className={`px-2 py-0.5 rounded-full font-medium border ${
                conditionColors[product.condition] || "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {product.condition}
            </span>
            {product.listingType && product.listingType !== "For Sale" && (
              <span className="font-semibold text-brand-accent uppercase tracking-wide">
                {product.listingType}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/marketplace/${product._id}`}>
            <h3 className="font-bold text-base text-brand-textMain group-hover:text-brand-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-brand-primary">
              {product.price === 0 ? "Free" : formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-brand-textMuted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                {discount && (
                  <span className="text-[11px] font-semibold text-emerald-600">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Seller Info & Location Footer */}
        <div className="pt-3 mt-3 border-t border-brand-border flex items-center justify-between text-xs text-brand-textMuted">
          <div className="flex items-center gap-1.5 truncate max-w-[130px]">
            <User className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span className="truncate">{product.sellerName || "Campus Student"}</span>
          </div>
          {product.location && (
            <div className="flex items-center gap-1 truncate max-w-[110px]">
              <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
