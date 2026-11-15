"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "../../../../components/ProductForm";
import { ArrowLeft, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          toast.error("Product not found");
          router.push("/my-listings");
        }
      } catch (err) {
        toast.error("Error loading product");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-xs text-brand-textMuted">Loading listing details...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-brand-border pb-6">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textMuted hover:text-brand-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
            <Edit3 className="w-4 h-4 text-brand-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary">Edit Listing</h1>
        </div>
        <p className="text-xs sm:text-sm text-brand-textMuted">
          Update the price, condition, description, photos or contact details for your product.
        </p>
      </div>

      {/* Product Form in Edit Mode */}
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
