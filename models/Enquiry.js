import mongoose from "mongoose";

// =============================================================================
// Enquiry & Offer Model for CampusMart
// Represents buyer questions and price negotiation offers sent to campus sellers
// =============================================================================

const EnquirySchema = new mongoose.Schema(
  {
    // Reference to the product being enquired about
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    // Name of the student inquiring or making an offer
    buyerName: {
      type: String,
      required: [true, "Buyer name is required"],
      trim: true,
    },
    // Campus email of the buyer for seller to respond
    buyerEmail: {
      type: String,
      required: [true, "Buyer email is required"],
      trim: true,
      lowercase: true,
    },
    // Message body (questions about item condition, meetup point, etc.)
    message: {
      type: String,
      required: [true, "Enquiry message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    // Optional counter-offer price in INR submitted by the buyer
    offerPrice: {
      type: Number,
      default: null,
      min: [0, "Offer price cannot be negative"],
    },
    // Current status of this enquiry/offer: Pending, Accepted, or Rejected
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export existing model if already compiled (for Next.js hot reload) or compile new one
export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
