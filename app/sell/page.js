import ProductForm from "../../components/ProductForm";
import { PlusCircle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Sell Your Product | CampusMart",
  description: "Create a new product listing on CampusMart student marketplace.",
};

export default function SellPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-brand-border pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          <PlusCircle className="w-3.5 h-3.5 text-brand-accent" />
          <span>Post New Campus Ad</span>
        </div>
        <h1 className="text-3xl font-extrabold text-brand-primary">Sell Your Product</h1>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          List your textbooks, scientific calculators, stationery, hostel furniture or gear. Fellow students can browse and reach out to you directly!
        </p>
      </div>

      {/* Sell Form */}
      <ProductForm />
    </div>
  );
}
