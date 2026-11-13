import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a user cannot favorite the same item twice
FavoriteSchema.index({ userEmail: 1, productId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
