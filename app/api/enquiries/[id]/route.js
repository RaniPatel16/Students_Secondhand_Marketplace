import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Enquiry from "../../../../models/Enquiry";

// =============================================================================
// PATCH /api/enquiries/[id]
// Allows a seller to accept or reject an enquiry or counter-offer
// Permitted status transitions: "Pending", "Accepted", "Rejected"
// =============================================================================
export async function PATCH(request, { params }) {
  try {
    // 1. Establish database connection
    await connectToDatabase();
    const { id } = params;

    // 2. Parse status from request body
    const body = await request.json();
    const { status } = body;

    // 3. Validate that the status is one of the permitted enum values
    const validStatuses = ["Pending", "Accepted", "Rejected"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    // 4. Update enquiry status and return updated document
    const updated = await Enquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Enquiry ${status.toLowerCase()} successfully`,
      enquiry: updated,
    });
  } catch (error) {
    console.error("PATCH /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update enquiry status", error: error.message },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/enquiries/[id]
// Allows removing an old or dismissed enquiry
// =============================================================================
export async function DELETE(request, { params }) {
  try {
    // 1. Establish database connection
    await connectToDatabase();
    const { id } = params;

    // 2. Find and delete enquiry by ID
    const deleted = await Enquiry.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete enquiry", error: error.message },
      { status: 500 }
    );
  }
}
