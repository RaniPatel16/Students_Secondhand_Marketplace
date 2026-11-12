export function ProductCardSkeleton() {
  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-sm animate-pulse flex flex-col">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-brand-border/60" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-brand-border/70 rounded-md" />
            <div className="h-4 w-12 bg-brand-border/60 rounded-md" />
          </div>
          <div className="h-5 w-3/4 bg-brand-border/80 rounded-md" />
          <div className="h-4 w-1/2 bg-brand-border/50 rounded-md" />
        </div>

        <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between">
          <div className="h-6 w-20 bg-brand-border/80 rounded-md" />
          <div className="h-4 w-16 bg-brand-border/50 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-96 bg-brand-border/60 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-6 w-24 bg-brand-border/70 rounded-md" />
          <div className="h-10 w-3/4 bg-brand-border/90 rounded-md" />
          <div className="h-8 w-32 bg-brand-border/80 rounded-md" />
          <div className="h-24 bg-brand-border/50 rounded-2xl" />
          <div className="h-12 w-full bg-brand-border/70 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
