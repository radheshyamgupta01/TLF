import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import Inquiry from "@/models/Inquiry";

export async function PATCH(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Extract inquiry ID
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const inquiryId = pathParts[pathParts.length - 1];

    if (!inquiryId || inquiryId === "inquiries") {
      return errorResponse("Inquiry ID is required", 400);
    }

    const { status } = await request.json();

    if (
      !status ||
      !["new", "contacted", "interested", "not-interested", "closed"].includes(
        status
      )
    ) {
      return errorResponse("Invalid status", 400);
    }

    // First fetch the inquiry
    const existingInquiry = await Inquiry.findOne({
      _id: inquiryId,
      listingOwnerId: authResult.user._id,
    });

    if (!existingInquiry) {
      return errorResponse("Inquiry not found or unauthorized", 404);
    }

    // Prepare update data
    const updateData = { status };
    if (status === "contacted" && !existingInquiry.respondedAt) {
      updateData.respondedAt = new Date();
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      updateData,
      { new: true }
    ).populate("listingId", "title");

    return successResponse(
      updatedInquiry,
      "Inquiry status updated successfully"
    );
  } catch (error) {
    console.error("Update inquiry error:", error);

    if (error.name === "CastError") {
      return errorResponse("Invalid inquiry ID format", 400);
    }

    return errorResponse("Failed to update inquiry", 500);
  }
}
