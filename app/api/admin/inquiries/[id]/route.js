import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import Inquiry from "@/models/Inquiry";
import { adminMiddleware } from "@/middleware/adminMiddleware";

export async function PATCH(request) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { pathname } = new URL(request.url);
    const inquiryId = pathname.split("/").pop();

    if (!inquiryId) {
      return errorResponse("Inquiry ID is required", 400);
    }

    const body = await request.json();
    const { status, priority, response, assignTo } = body;

    // Validate status if provided
    if (
      status &&
      !["new", "contacted", "interested", "not-interested", "closed"].includes(
        status
      )
    ) {
      return errorResponse("Invalid status", 400);
    }

    // Validate priority if provided
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return errorResponse("Invalid priority", 400);
    }

    // Build update object
    const updateFields = {};
    if (status) updateFields.status = status;
    if (priority) updateFields.priority = priority;
    if (response) updateFields.response = response;
    if (assignTo) updateFields.listingOwnerId = assignTo;

    // Auto-set respondedAt if status is being changed to contacted and response is provided
    if (status === "contacted" && response) {
      updateFields.respondedAt = new Date();
    }

    // Admin can update any inquiry
    const inquiry = await Inquiry.findByIdAndUpdate(inquiryId, updateFields, {
      new: true,
    })
      .populate("listingId", "title propertyType listingType price")
      .populate("inquirerUserId", "name email")
      .populate("listingOwnerId", "name email");

    if (!inquiry) {
      return errorResponse("Inquiry not found", 404);
    }

    return successResponse(inquiry, "Inquiry updated successfully");
  } catch (error) {
    console.error("Update inquiry error:", error);

    if (error.name === "CastError") {
      return errorResponse("Invalid inquiry ID format", 400);
    }

    return errorResponse("Failed to update inquiry", 500);
  }
}
