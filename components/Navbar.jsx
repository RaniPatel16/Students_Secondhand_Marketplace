"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  PlusCircle,
  Menu,
  X,
  User,
  Compass,
  Layers,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("rani.patel@campus.edu");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Read active user email from localStorage on client
  useEffect(() => {
    const saved = localStorage.getItem("campusmart_user_email");
    if (saved) {
      setCurrentEmail(saved);
    } else {
      localStorage.setItem("campusmart_user_email", "rani.patel@campus.edu");
    }
  }, []);

  const handleUserChange = (email) => {
    setCurrentEmail(email);
    localStorage.setItem("campusmart_user_email", email);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event("campusmart_user_changed"));
  };

  const navLinks = [
    { name: "Explore", href: "/marketplace", icon: Compass },
    { name: "My Listings", href: "/my-listings", icon: Layers },
    { name: "Favorites", href: "/favorites", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 bg-brand-surface/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm group-hover:bg-brand-primaryHover transition-colors">
              <ShoppingBag className="w-5 h-5 text-brand-accent" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-brand-primary">
                Campus<span className="text-brand-accent">Mart</span>
              </span>
              <span className="text-[10px] text-brand-textMuted font-medium -mt-1 tracking-wider uppercase">
                Student Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-brand-primary bg-brand-primary/5 font-semibold"
                      : "text-brand-textMuted hover:text-brand-primary hover:bg-brand-canvas"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-accent" : "text-brand-textMuted"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Demo User Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-brand-border bg-brand-canvas text-brand-textMain hover:border-brand-accent transition-colors"
                title="Switch demo profile"
              >
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-bold">
                  {currentEmail.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[130px] truncate">{currentEmail}</span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-textMuted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-brand-surface rounded-xl shadow-lg border border-brand-border py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-brand-textMuted uppercase tracking-wider">
                    Demo Student Profiles
                  </div>
                  <button
                    onClick={() => handleUserChange("rani.patel@campus.edu")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-brand-canvas transition-colors ${
                      currentEmail === "rani.patel@campus.edu" ? "text-brand-primary font-bold bg-brand-canvas/60" : "text-brand-textMain"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Rani Patel (rani.patel@campus.edu)</span>
                  </button>
                  <button
                    onClick={() => handleUserChange("arjun.sharma@campus.edu")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-brand-canvas transition-colors ${
                      currentEmail === "arjun.sharma@campus.edu" ? "text-brand-primary font-bold bg-brand-canvas/60" : "text-brand-textMain"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Arjun Sharma (arjun.sharma@campus.edu)</span>
                  </button>
                  <button
                    onClick={() => handleUserChange("sneha.verma@campus.edu")}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-brand-canvas transition-colors ${
                      currentEmail === "sneha.verma@campus.edu" ? "text-brand-primary font-bold bg-brand-canvas/60" : "text-brand-textMain"
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-brand-accent" />
                    <span>Sneha Verma (sneha.verma@campus.edu)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sell CTA button */}
            <Link
              href="/sell"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-accent text-white hover:bg-brand-accentHover shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Item</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/sell"
              className="p-2 rounded-lg bg-brand-accent text-white"
              title="Sell"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-textMain hover:bg-brand-canvas border border-brand-border"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-brand-surface px-4 pt-3 pb-6 space-y-3">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-brand-primary bg-brand-primary/10 font-bold"
                      : "text-brand-textMain hover:bg-brand-canvas"
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-accent" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-brand-border">
            <div className="text-xs text-brand-textMuted mb-2 font-medium">Logged in profile:</div>
            <select
              value={currentEmail}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-brand-border bg-brand-canvas text-brand-textMain"
            >
              <option value="rani.patel@campus.edu">Rani Patel (rani.patel@campus.edu)</option>
              <option value="arjun.sharma@campus.edu">Arjun Sharma (arjun.sharma@campus.edu)</option>
              <option value="sneha.verma@campus.edu">Sneha Verma (sneha.verma@campus.edu)</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
}
