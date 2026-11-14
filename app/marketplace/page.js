"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "../../components/SearchBar";
import ProductGrid from "../../components/ProductGrid";
import CategoryFilter from "../../components/CategoryFilter";
import { ArrowUpDown } from "lucide-react";

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [condition, setCondition] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Fetch user favorites
  const fetchFavorites = async () => {
    try {
      const userEmail = localStorage.getItem("campusmart_user_email") || "rani.patel@campus.edu";
      const res = await fetch(`/api/favorites?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.favorites)) {
        setFavoriteIds(data.favorites.map((fav) => fav.productId?._id || fav.productId));
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  // Fetch products from API with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (category && category !== "All") params.append("category", category);
      if (condition && condition !== "All") params.append("condition", condition);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sort) params.append("sort", sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, category, condition, minPrice, maxPrice, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setCondition("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-primary">Campus Marketplace</h1>
          <p className="text-xs sm:text-sm text-brand-textMuted mt-1">
            Browse verified second-hand items listed by college students
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <SearchBar
            value={search}
            onChange={(val) => setSearch(val)}
            onClear={() => setSearch("")}
          />
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <CategoryFilter
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
          selectedCondition={condition}
          onSelectCondition={(cond) => setCondition(cond)}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
          onResetFilters={handleResetFilters}
        />

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Controls Bar: Count & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-surface p-3.5 rounded-2xl border border-brand-border">
            <div className="text-xs font-medium text-brand-textMuted">
              Showing <span className="font-bold text-brand-primary">{products.length}</span> items
              {category !== "All" && (
                <span className="ml-1 px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary font-semibold">
                  {category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-textMuted flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-brand-accent" />
                Sort by:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs font-semibold bg-brand-canvas border border-brand-border rounded-xl px-3 py-1.5 text-brand-textMain focus:outline-none focus:border-brand-primary"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            favoriteIds={favoriteIds}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-sm text-brand-textMuted">Loading marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
