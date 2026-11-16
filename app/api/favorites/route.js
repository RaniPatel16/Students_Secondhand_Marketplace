import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Favorite from "../../../models/Favorite";
import Product from "../../../models/Product";

// GET /api/favorites - Get user's favorite products
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "User email parameter is required" },
        { status: 400 }
      );
    }

    const favorites = await Favorite.find({ userEmail: userEmail.toLowerCase() })
      .populate("productId")
      .sort({ createdAt: -1 })
      .lean();

    // Filter out any favorites whose products were deleted
    const validFavorites = favorites.filter((fav) => fav.productId != null);

    return NextResponse.json({
      success: true,
      count: validFavorites.length,
      favorites: validFavorites,
    });
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch favorites", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add product to favorites
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { productId, userEmail } = body;

    if (!productId || !userEmail) {
      return NextResponse.json(
        { success: false, message: "Product ID and user email are required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Upsert or create favorite record
    const favorite = await Favorite.findOneAndUpdate(
      { userEmail: userEmail.toLowerCase(), productId },
      { userEmail: userEmail.toLowerCase(), productId },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Saved to favorites",
        favorite,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add favorite", error: error.message },
      { status: 500 }
    );
  }
}
