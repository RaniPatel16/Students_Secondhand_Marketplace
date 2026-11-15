"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { validateProductData } from "../lib/validations";
import toast from "react-hot-toast";

const CATEGORIES = ["Books", "Electronics", "Furniture", "Stationery", "Other"];
const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const LISTING_TYPES = ["For Sale", "Free", "Exchange"];

export default function ProductForm({ initialData = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price !== undefined ? initialData.price : "",
    originalPrice: initialData?.originalPrice || "",
    category: initialData?.category || "Books",
    condition: initialData?.condition || "Good",
    listingType: initialData?.listingType || "For Sale",
    images: initialData?.images || [],
    sellerName: initialData?.sellerName || "Rani Patel",
    sellerEmail: initialData?.sellerEmail || "rani.patel@campus.edu",
    sellerPhone: initialData?.sellerPhone || "+91 98765 43210",
    location: initialData?.location || "Girls Hostel 3, Room 204",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Sync seller email from localStorage if creating fresh listing
  useEffect(() => {
    if (!initialData) {
      const savedEmail = localStorage.getItem("campusmart_user_email");
      if (savedEmail) {
        setFormData((prev) => ({
          ...prev,
          sellerEmail: savedEmail,
          sellerName: savedEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        }));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Add image by URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    if (formData.images.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  // Add image by file upload (reads as base64 data URI)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    if (formData.images.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, event.target.result],
      }));
      toast.success("Image uploaded!");
    };
    reader.readAsDataURL(file);
  };

  // Remove image from list
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const validation = validateProductData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fill all required fields correctly");
      return;
    }

    setSubmitting(true);

    try {
      const endpoint = isEdit ? `/api/products/${initialData._id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(isEdit ? "Listing updated successfully!" : "Product listed successfully!");
        router.push(isEdit ? `/marketplace/${initialData._id}` : `/marketplace/${data.product._id}`);
      } else {
        toast.error(data.message || "Failed to save product");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Product Basic Information */}
      <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-brand-primary flex items-center gap-2">
          <span>Item Details</span>
        </h2>

        {/* Product Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Higher Engineering Mathematics - B.S. Grewal (44th Ed)"
            className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
              errors.name ? "border-red-500" : "border-brand-border"
            }`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:border-brand-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Condition <span className="text-red-500">*</span>
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:border-brand-primary"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Listing Type
            </label>
            <select
              name="listingType"
              value={formData.listingType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:border-brand-primary"
            >
              {LISTING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Selling Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              placeholder="0 (Enter 0 for Free items)"
              className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                errors.price ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Original Retail Price (₹) (Optional)
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 850 (Shows discount % to buyers)"
              className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mention edition, semesters used, condition details, why you are selling, and handover availability..."
            className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
              errors.description ? "border-red-500" : "border-brand-border"
            }`}
          />
          {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
        </div>
      </div>

      {/* Image Upload & Management */}
      <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-brand-primary">Product Photos</h2>
        <p className="text-xs text-brand-textMuted">
          Upload up to 5 clear photos of your item (via file upload or image URL).
        </p>

        {/* Image Preview List */}
        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-brand-border shadow-sm group">
                <img src={img} alt="Product preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* File Picker */}
          <label className="border-2 border-dashed border-brand-border hover:border-brand-accent rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 bg-brand-canvas/50">
            <Upload className="w-6 h-6 text-brand-accent" />
            <span className="text-xs font-semibold text-brand-textMain">Choose file from device</span>
            <span className="text-[10px] text-brand-textMuted">PNG, JPG, WEBP up to 5MB</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* URL Input */}
          <div className="border border-brand-border rounded-2xl p-5 flex flex-col justify-center space-y-3 bg-brand-canvas/30">
            <span className="text-xs font-semibold text-brand-textMain flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-brand-accent" />
              <span>Or paste Image URL</span>
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-surface text-brand-textMain focus:outline-none focus:border-brand-primary"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-brand-primaryHover"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Information */}
      <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-brand-primary">Seller Campus Contact</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                errors.sellerName ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.sellerName && <p className="text-xs text-red-600 mt-1">{errors.sellerName}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Student Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="sellerEmail"
              value={formData.sellerEmail}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                errors.sellerEmail ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.sellerEmail && <p className="text-xs text-red-600 mt-1">{errors.sellerEmail}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Phone / WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sellerPhone"
              value={formData.sellerPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                errors.sellerPhone ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.sellerPhone && <p className="text-xs text-red-600 mt-1">{errors.sellerPhone}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Campus Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Girls Hostel 3, Room 204 or Main Quad"
              className={`w-full px-4 py-2.5 rounded-xl border bg-brand-canvas text-sm text-brand-textMain focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                errors.location ? "border-red-500" : "border-brand-border"
              }`}
            />
            {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-brand-border text-xs font-semibold text-brand-textMuted hover:bg-brand-canvas transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primaryHover shadow-md flex items-center gap-2 disabled:opacity-50 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Listing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span>{isEdit ? "Update Listing" : "Publish Listing"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
