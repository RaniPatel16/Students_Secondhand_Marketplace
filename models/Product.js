import mongoose from "mongoose";

// Product Model Schema for CampusMart
// Represents second-hand study and hostel items listed by college students
const ProductSchema = new mongoose.Schema(
  {
    // Item title (e.g. textbook name, calculator model)
    name: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    // Detailed item condition, edition, reason for selling
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    // Selling price in Indian Rupees (0 for Free items)
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    // Original retail price to calculate student discount percentage
    originalPrice: {
      type: Number,
      default: null,
      min: [0, "Original price cannot be negative"],
    },
    // Category classification
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Books", "Electronics", "Furniture", "Stationery", "Other"],
        message: "{VALUE} is not a valid category",
      },
    },
    // Condition of the item
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: {
        values: ["New", "Like New", "Good", "Fair"],
        message: "{VALUE} is not a valid condition",
      },
    },
    // Listing type: For Sale, Free giveaway, or Exchange
    listingType: {
      type: String,
      default: "For Sale",
      enum: ["For Sale", "Free", "Exchange"],
    },
    // Uploaded photo URLs or base64 images
    images: {
      type: [String],
      default: [],
    },
    // Student seller details
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
    // Availability status: Available, Reserved, or Sold
    status: {
      type: String,
      default: "Available",
      enum: ["Available", "Reserved", "Sold"],
    },
    // Visibility toggle (active or draft/hidden)
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
