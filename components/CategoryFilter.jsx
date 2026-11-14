"use client";

import { useState } from "react";
import { Filter, X, RotateCcw, Check, Sparkles } from "lucide-react";

export const CATEGORIES = [
  { id: "All", name: "All Categories" },
  { id: "Books", name: "Books" },
  { id: "Electronics", name: "Electronics" },
  { id: "Furniture", name: "Furniture" },
  { id: "Stationery", name: "Stationery" },
  { id: "Other", name: "Other" },
];

export const CONDITIONS = ["All", "New", "Like New", "Good", "Fair"];

export default function CategoryFilter({
  selectedCategory = "All",
  onSelectCategory,
  selectedCondition = "All",
  onSelectCondition,
  minPrice = "",
  maxPrice = "",
  onPriceChange,
  onResetFilters,
}) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleApplyPrice = (e) => {
    e.preventDefault();
    onPriceChange(localMin, localMax);
    setIsOpenMobile(false);
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    onResetFilters();
    setIsOpenMobile(false);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-3">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-brand-primary text-white font-semibold shadow-sm"
                    : "text-brand-textMain hover:bg-brand-canvas"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-accent" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Filter */}
      <div className="pt-4 border-t border-brand-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-3">
          Condition
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map((cond) => {
            const isSelected = selectedCondition === cond;
            return (
              <button
                key={cond}
                onClick={() => {
                  onSelectCondition(cond);
                  setIsOpenMobile(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                    : "bg-brand-surface text-brand-textMain border-brand-border hover:border-brand-accent/50"
                }`}
              >
                {cond}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-brand-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-3">
          Price Range (₹)
        </h3>
        <form onSubmit={handleApplyPrice} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-brand-textMuted uppercase font-semibold">Min</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-border bg-brand-surface text-brand-textMain focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="text-[10px] text-brand-textMuted uppercase font-semibold">Max</label>
              <input
                type="number"
                placeholder="5000"
                min="0"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-brand-border bg-brand-surface text-brand-textMain focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primaryHover transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Reset Filter Button */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-textMuted hover:text-brand-primary border border-brand-border rounded-xl hover:bg-brand-canvas transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-brand-border bg-brand-surface text-brand-primary hover:border-brand-accent transition-colors shadow-sm"
        >
          <Filter className="w-4 h-4 text-brand-accent" />
          <span>Filters</span>
          {(selectedCategory !== "All" || selectedCondition !== "All" || minPrice || maxPrice) && (
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
          )}
        </button>

        {/* Mobile Filter Modal */}
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-brand-surface rounded-3xl border border-brand-border max-w-sm w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
                <div className="flex items-center gap-2 font-bold text-brand-primary text-base">
                  <Filter className="w-4 h-4 text-brand-accent" />
                  <span>Filter Products</span>
                </div>
                <button
                  onClick={() => setIsOpenMobile(false)}
                  className="p-1.5 rounded-lg text-brand-textMuted hover:bg-brand-canvas"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar Filter Card */}
      <aside className="hidden lg:block w-64 shrink-0 bg-brand-surface p-5 rounded-2xl border border-brand-border shadow-sm self-start sticky top-24">
        <div className="flex items-center gap-2 font-bold text-brand-primary text-sm pb-3 border-b border-brand-border mb-4">
          <Filter className="w-4 h-4 text-brand-accent" />
          <span>Filter Products</span>
        </div>
        {filterContent}
      </aside>
    </>
  );
}
