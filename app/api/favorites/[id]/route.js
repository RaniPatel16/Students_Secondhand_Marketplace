import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Favorite from "../../../../models/Favorite";

// DELETE /api/favorites/[id] - Remove product from favorites
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    let query = {};
    if (userEmail) {
      // Allow deleting by productId matching the user's email
      query = {
        userEmail: userEmail.toLowerCase(),
        $or: [{ productId: id }, { _id: id }],
      };
    } else {
      query = { _id: id };
    }

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
