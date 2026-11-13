import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    buyerName: {
      type: String,
      required: [true, "Buyer name is required"],
      trim: true,
    },
    buyerEmail: {
      type: String,
      required: [true, "Buyer email is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, "Enquiry message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    offerPrice: {
      type: Number,
      default: null,
      min: [0, "Offer price cannot be negative"],
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
