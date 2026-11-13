import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: null,
      min: [0, "Original price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Books", "Electronics", "Furniture", "Stationery", "Other"],
        message: "{VALUE} is not a valid category",
      },
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: {
        values: ["New", "Like New", "Good", "Fair"],
        message: "{VALUE} is not a valid condition",
      },
    },
    listingType: {
      type: String,
      default: "For Sale",
      enum: ["For Sale", "Free", "Exchange"],
    },
    images: {
      type: [String],
      default: [],
    },
    sellerName: {
      type: String,
      required: [true, "Seller name is required"],
      trim: true,
    },
    sellerEmail: {
      type: String,
      required: [true, "Seller email is required"],
      trim: true,
      lowercase: true,
    },
    sellerPhone: {
      type: String,
      required: [true, "Seller contact number is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Campus location is required"],
      trim: true,
    },
    status: {
      type: String,
      default: "Available",
      enum: ["Available", "Reserved", "Sold"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search index for text querying
ProductSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
