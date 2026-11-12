import Link from "next/link";
import { ShoppingBag, ShieldCheck, Heart, MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white border-t border-brand-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-surface flex items-center justify-center text-brand-primary">
                <ShoppingBag className="w-5 h-5 text-brand-accent" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Campus<span className="text-brand-accent">Mart</span>
              </span>
            </div>
            <p className="text-xs text-brand-surface/75 leading-relaxed">
              Buy Smart. Sell Easy. Reuse More.
              The trusted campus marketplace designed by students, for students.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-accent">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Verified Peer-to-Peer</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-brand-surface/80">
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  All Marketplace Listings
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-white transition-colors">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link href="/my-listings" className="hover:text-white transition-colors">
                  My Active Listings
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-white transition-colors">
                  Saved Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-brand-surface/80">
              <li>
                <Link href="/marketplace?category=Books" className="hover:text-white transition-colors">
                  Books & Study Material
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Electronics" className="hover:text-white transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Furniture" className="hover:text-white transition-colors">
                  Hostel Furniture
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Stationery" className="hover:text-white transition-colors">
                  Stationery & Tools
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Other" className="hover:text-white transition-colors">
                  Cycles & Other Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Safety Guidelines */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-accent mb-4">
              Campus Safety
            </h4>
            <p className="text-xs text-brand-surface/75 leading-relaxed">
              Always meet in busy campus spots (Library, Cafeteria, Student Centre) to inspect items before completing transactions.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-surface/70">
              <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>Campus Quad & Hostels</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-surface/70">
              <Mail className="w-3.5 h-3.5 text-brand-accent shrink-0" />
              <span>support@campusmart.edu</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-surface/60 gap-4">
          <p>© {new Date().getFullYear()} CampusMart. Built for university student community.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
            <span>for academic assignment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
