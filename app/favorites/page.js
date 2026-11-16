"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, ShoppingBag, MapPin, Tag } from "lucide-react";
import { formatPrice } from "../../lib/utils";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState("rani.patel@campus.edu");

  const loadFavorites = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/favorites?userEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      toast.error("Failed to load saved items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
    setCurrentEmail(savedEmail);
    loadFavorites(savedEmail);

    const handleUserChanged = () => {
      const updated = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
      setCurrentEmail(updated);
      loadFavorites(updated);
    };

    window.addEventListener("campusmart_user_changed", handleUserChanged);
    return () => window.removeEventListener("campusmart_user_changed", handleUserChanged);
  }, []);

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`/api/favorites/${productId}?userEmail=${encodeURIComponent(currentEmail)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => (item.productId?._id || item.productId) !== productId));
        toast.success("Removed from favorites");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (err) {
      toast.error("Error removing favorite");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Saved Items Wishlist</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-primary">My Favorites</h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Keep track of campus items you're interested in buying or negotiating.
          </p>
        </div>

        <div className="text-xs font-medium px-4 py-2 bg-brand-surface rounded-xl border border-brand-border">
          Active Profile: <strong className="text-brand-primary">{currentEmail}</strong>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-brand-surface rounded-2xl border border-brand-border" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        /* Empty State */
        <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-brand-primary">No saved favorites yet</h2>
          <p className="text-xs sm:text-sm text-brand-textMuted leading-relaxed">
            Whenever you see a product you like, click the heart icon to save it here for later.
          </p>
          <div className="pt-2">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-primaryHover transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-brand-accent" />
              <span>Browse Campus Marketplace</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav) => {
            const product = fav.productId;
            if (!product) return null;

            return (
              <div
                key={fav._id}
                className="group relative bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-accent/50 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-canvas">
                    <Link href={`/marketplace/${product._id}`}>
                      <img
                        src={
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-red-50 text-red-600 shadow-sm hover:scale-110 transition-all"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-brand-primary shadow-sm border border-brand-border">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-brand-textMuted">
                      <span className="font-medium px-2 py-0.5 rounded bg-brand-canvas border border-brand-border">
                        {product.condition}
                      </span>
                      {product.status && product.status !== "Available" && (
                        <span className="text-red-600 font-bold uppercase">{product.status}</span>
                      )}
                    </div>

                    <Link href={`/marketplace/${product._id}`}>
                      <h3 className="font-bold text-sm text-brand-textMain group-hover:text-brand-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="text-base font-extrabold text-brand-primary">
                      {product.price === 0 ? "Free" : formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  <Link
                    href={`/marketplace/${product._id}`}
                    className="w-full py-2 px-3 rounded-xl bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
