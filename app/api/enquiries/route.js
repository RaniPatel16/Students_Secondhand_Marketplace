import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Enquiry from "../../../models/Enquiry";
import Product from "../../../models/Product";

// =============================================================================
// GET /api/enquiries
// Retrieves enquiries and offers based on query params:
// - sellerEmail: Returns enquiries received for products listed by this seller
// - buyerEmail: Returns enquiries/offers submitted by this student as a buyer
// - productId: Returns enquiries specific to a single product listing
// =============================================================================
export async function GET(request) {
  try {
    // 1. Establish database connection
    await connectToDatabase();

    // 2. Extract query filters from URL
    const { searchParams } = new URL(request.url);
    const sellerEmail = searchParams.get("sellerEmail");
    const buyerEmail = searchParams.get("buyerEmail");
    const productId = searchParams.get("productId");

    let query = {};

    // 3. Determine query criteria
    if (productId) {
      // Inquiries for a specific product
      query.productId = productId;
    } else if (sellerEmail) {
      // Find all product IDs owned by this seller
      const sellerProducts = await Product.find({ sellerEmail: sellerEmail.toLowerCase() }, "_id");
      const productIds = sellerProducts.map((p) => p._id);
      query.productId = { $in: productIds };
    } else if (buyerEmail) {
      // Find all offers sent out by this buyer
      query.buyerEmail = buyerEmail.toLowerCase();
    }

    // 4. Query DB, populate referenced product details, sort newest first
    const enquiries = await Enquiry.find(query)
      .populate("productId", "name price images category status sellerName sellerEmail sellerPhone location")
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

// =============================================================================
// POST /api/enquiries
// Allows interested students to submit a question or price offer to the seller
// =============================================================================
export async function POST(request) {
  try {
    // 1. Establish database connection
    await connectToDatabase();

    // 2. Parse request JSON body
    const body = await request.json();
    const { productId, buyerName, buyerEmail, message, offerPrice } = body;

    // 3. Validate mandatory fields
    if (!productId || !buyerName || !buyerEmail || !message) {
      return NextResponse.json(
        { success: false, message: "Please fill all required enquiry fields" },
        { status: 400 }
      );
    }

    // 4. Verify that the referenced product exists in DB
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product no longer available" },
        { status: 404 }
      );
    }

    // 5. Create new enquiry record with default 'Pending' status
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
