import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Enquiry from "../../../models/Enquiry";
import Product from "../../../models/Product";

// GET /api/enquiries - Fetch enquiries for a seller or specific product
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sellerEmail = searchParams.get("sellerEmail");
    const productId = searchParams.get("productId");

    let query = {};

    if (productId) {
      query.productId = productId;
    } else if (sellerEmail) {
      // Find all products listed by this seller first
      const sellerProducts = await Product.find({ sellerEmail: sellerEmail.toLowerCase() }, "_id");
      const productIds = sellerProducts.map((p) => p._id);
      query.productId = { $in: productIds };
    }

    const enquiries = await Enquiry.find(query)
      .populate("productId", "name price images category status")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries", error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/enquiries - Submit an enquiry or offer on a product
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { productId, buyerName, buyerEmail, message, offerPrice } = body;

    // Validate fields
    if (!productId || !buyerName || !buyerEmail || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill all required enquiry fields" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product no longer available" },
        { status: 404 }
      );
    }

    const newEnquiry = await Enquiry.create({
      productId,
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      message: message.trim(),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent to the seller!",
        enquiry: newEnquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit enquiry", error: error.message },
      { status: 500 }
    );
  }
}
