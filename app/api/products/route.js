import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";

// GET /api/products - List products with multi-attribute filtering & sorting
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const condition = searchParams.get("condition") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sellerEmail = searchParams.get("sellerEmail");
    const includeDrafts = searchParams.get("includeDrafts") === "true";
    const sort = searchParams.get("sort") || "newest";
    const limit = parseInt(searchParams.get("limit")) || 0;

    // Build Mongoose query
    const query = {};

    // Filter by seller email if provided
    if (sellerEmail) {
      query.sellerEmail = sellerEmail.toLowerCase();
      // If not seller's own dashboard, only show active listings
      if (!includeDrafts) {
        query.isActive = true;
      }
    } else {
      query.isActive = true;
    }

    // Text search in name or description
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== "All") {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc") {
      sortOptions = { price: -1 };
    } else if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    }

    let productsQuery = Product.find(query).sort(sortOptions);

    if (limit > 0) {
      productsQuery = productsQuery.limit(limit);
    }

    const products = await productsQuery.lean();

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product listing
export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      condition,
      listingType,
      images,
      sellerName,
      sellerEmail,
      sellerPhone,
      location,
    } = body;

    // Validate required fields
    if (!name || !description || price === undefined || !category || !condition || !sellerName || !sellerEmail || !sellerPhone || !location) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required fields",
        },
        { status: 400 }
      );
    }

    // Validate numerical values
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid positive number",
        },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      category,
      condition,
      listingType: listingType || "For Sale",
      images: Array.isArray(images) && images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
      ],
      sellerName: sellerName.trim(),
      sellerEmail: sellerEmail.trim().toLowerCase(),
      sellerPhone: sellerPhone.trim(),
      location: location.trim(),
      status: "Available",
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product listed successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product listing",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
