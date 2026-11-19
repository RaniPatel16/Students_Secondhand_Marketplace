import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import Favorite from "../../../../models/Favorite";
import Enquiry from "../../../../models/Enquiry";

// GET /api/products/[id] - Get single product details
export async function GET(request, { params }) {
  try {
    // 1. Connect to database
    await connectToDatabase();
    const { id } = params;

    // 2. Query product by MongoDB ObjectId
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Invalid product ID or server error", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product details or status (Available, Reserved, Sold)
export async function PUT(request, { params }) {
  try {
    // 1. Connect to database
    await connectToDatabase();
    const { id } = params;
    const updateData = await request.json();

    // 2. Find and update product with validation
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product listing with cascade cleanup
export async function DELETE(request, { params }) {
  try {
    // 1. Connect to database
    await connectToDatabase();
    const { id } = params;

    // 2. Remove product from database
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // 3. Cascade cleanup: automatically remove saved favorites and enquiries tied to this deleted product
    await Promise.all([
      Favorite.deleteMany({ productId: id }),
      Enquiry.deleteMany({ productId: id }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Product and associated records deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
