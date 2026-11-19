import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Favorite from "../../../../models/Favorite";

// =============================================================================
// DELETE /api/favorites/[id]
// Removes a product from a student's saved favorites list
// Supports deleting by favorite record ID or by productId with userEmail
// =============================================================================
export async function DELETE(request, { params }) {
  try {
    // 1. Establish database connection
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    // 2. Build deletion filter: either by product reference + user email, or directly by favorite _id
    let query = {};
    if (userEmail) {
      query = {
        userEmail: userEmail.toLowerCase(),
        $or: [{ productId: id }, { _id: id }],
      };
    } else {
      query = { _id: id };
    }

    // 3. Find and remove matching favorite entry
    const deleted = await Favorite.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Favorite entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("DELETE /api/favorites/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove favorite", error: error.message },
      { status: 500 }
    );
  }
}
