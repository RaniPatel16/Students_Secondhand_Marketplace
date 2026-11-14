"use client";

import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./LoadingSkeleton";
import { PackageOpen, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProductGrid({
  products = [],
  loading = false,
  favoriteIds = [],
  onFavoriteChange,
  onResetFilters,
}) {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center max-w-xl mx-auto my-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
          <PackageOpen className="w-8 h-8 text-brand-accent" />
        </div>
        <h3 className="text-xl font-bold text-brand-primary">No matching products found</h3>
        <p className="text-sm text-brand-textMuted max-w-sm mx-auto">
          We couldn't find any student listings matching your current search or filter criteria.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-brand-border hover:bg-brand-canvas transition-colors"
            >
              Clear All Filters
            </button>
          )}
          <Link
            href="/sell"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-primary text-white hover:bg-brand-primaryHover transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Be the first to list one</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const isFav = favoriteIds.includes(product._id);
        return (
          <ProductCard
            key={product._id}
            product={product}
            isFavoriteInitial={isFav}
            onFavoriteChange={onFavoriteChange}
          />
        );
      })}
    </div>
  );
}
