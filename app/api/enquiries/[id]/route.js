import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Enquiry from "../../../../models/Enquiry";

// PATCH /api/enquiries/[id] - Update enquiry status (Pending, Accepted, Rejected)
export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["Pending", "Accepted", "Rejected"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

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

// DELETE /api/enquiries/[id] - Delete an enquiry
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

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
