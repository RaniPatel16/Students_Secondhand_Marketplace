"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Laptop,
  Armchair,
  PenTool,
  Bike,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Tag,
  Users,
  Flame,
  Clock,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";

export const CATEGORIES = [
  {
    id: "Books",
    name: "Books & Notes",
    desc: "Engineering, medical, syllabus books & guides",
    icon: BookOpen,
    bg: "bg-amber-50 text-amber-900 border-amber-200",
  },
  {
    id: "Electronics",
    name: "Electronics & Tech",
    desc: "Calculators, headphones, chargers & monitors",
    icon: Laptop,
    bg: "bg-purple-50 text-purple-900 border-purple-200",
  },
  {
    id: "Furniture",
    name: "Hostel Furniture",
    desc: "Study desks, ergonomic chairs, bed tables",
    icon: Armchair,
    bg: "bg-rose-50 text-rose-900 border-rose-200",
  },
  {
    id: "Stationery",
    name: "Stationery & Tools",
    desc: "Lab coats, drafters, calculators & notebooks",
    icon: PenTool,
    bg: "bg-blue-50 text-blue-900 border-blue-200",
  },
  {
    id: "Other",
    name: "Cycles & Essentials",
    desc: "Campus bicycles, kettles, gym gear & more",
    icon: Bike,
    bg: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeProducts() {
      try {
        const res = await fetch("/api/products?limit=8");
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setFeaturedProducts(data.products.slice(0, 4));
          setRecentProducts(data.products.slice(4, 8));
        }
      } catch (err) {
        console.error("Error loading homepage products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/marketplace");
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-primary/5 via-brand-canvas to-brand-canvas pt-12 pb-16 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>Campus peer-to-peer student trading platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary leading-tight">
              Buy Smart. Sell Easy. <br />
              <span className="text-brand-accent">Reuse More.</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-textMuted leading-relaxed max-w-2xl mx-auto">
              Save money on expensive textbooks, find hostel furniture, and pass on your unused semester gear to fellow batchmates safely.
            </p>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-6 flex flex-col sm:flex-row items-center max-w-xl mx-auto gap-2 bg-brand-surface p-2 rounded-2xl border border-brand-border shadow-md"
            >
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="w-5 h-5 text-brand-textMuted shrink-0" />
                <input
                  type="text"
                  placeholder="Search textbooks, scientific calculators, chairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none text-brand-textMain placeholder:text-brand-textMuted/70"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover transition-colors flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/marketplace"
                className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-primaryHover shadow-sm transition-all"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/sell"
                className="px-6 py-3 rounded-xl bg-brand-accent text-white font-semibold text-sm hover:bg-brand-accentHover shadow-sm transition-all"
              >
                Sell Your Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-brand-accent text-brand-accent" />
                <span>Popular Picks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">
                Featured Campus Listings
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-xs sm:text-sm font-semibold text-brand-accent hover:text-brand-accentHover flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">
              Shop by Category
            </h2>
            <p className="text-sm text-brand-textMuted mt-1">
              Find exactly what you need for this semester
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-sm font-semibold text-brand-accent hover:text-brand-accentHover flex items-center gap-1 group"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/marketplace?category=${encodeURIComponent(cat.id)}`}
                className="group p-5 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-accent hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-transform group-hover:scale-105 ${cat.bg}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-brand-primary group-hover:text-brand-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-brand-accent gap-1">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recently Added Products */}
      {recentProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4 text-brand-accent" />
                <span>Freshly Posted</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary">
                Recently Added by Students
              </h2>
            </div>
            <Link
              href="/marketplace?sort=newest"
              className="text-xs sm:text-sm font-semibold text-brand-accent hover:text-brand-accentHover flex items-center gap-1 group"
            >
              <span>See more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Value Proposition Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-brand-surface border border-brand-border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 flex items-center justify-center text-brand-accent shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-primary">Student Budget Friendly</h4>
              <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
                Save up to 70% compared to brand new retail prices for engineering & university semester goods.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-brand-primary text-base">Direct Campus Handover</h4>
              <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
                Meet in the library or campus cafeteria to inspect items in person before paying.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-brand-primary text-base">Peer-to-Peer Zero Fees</h4>
              <p className="text-xs text-brand-textMuted mt-1 leading-relaxed">
                No middleman commissions or shipping fees. Direct student contact via email or phone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
