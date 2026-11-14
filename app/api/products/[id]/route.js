import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import Favorite from "../../../../models/Favorite";
import Enquiry from "../../../../models/Enquiry";

// GET /api/products/[id] - Get single product details
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

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

// PUT /api/products/[id] - Update product details or status
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updateData = await request.json();

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

// DELETE /api/products/[id] - Delete product listing
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Cascade delete: remove favorites and enquiries tied to this product
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
