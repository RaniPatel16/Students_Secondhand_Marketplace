import mongoose from "mongoose";

// =============================================================================
// Favorite / Saved Item Model for CampusMart
// Allows students to bookmark products they want to review or purchase later
// =============================================================================

const FavoriteSchema = new mongoose.Schema(
  {
    // The student's campus email who saved the item
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
    },
    // Reference to the bookmarked product document
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
  },
  {
    // Tracks when the user bookmarked the listing
    timestamps: true,
  }
);

// Compound unique index ensures a student cannot save the exact same item multiple times
FavoriteSchema.index({ userEmail: 1, productId: 1 }, { unique: true });

// Export existing model or compile new one (handles Next.js serverless caching)
export default mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
