"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, onClear, placeholder = "Search for books, gadgets, hostel furniture..." }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-brand-textMuted" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-sm text-brand-textMain placeholder:text-brand-textMuted/60 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-textMuted hover:text-brand-textMain"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
