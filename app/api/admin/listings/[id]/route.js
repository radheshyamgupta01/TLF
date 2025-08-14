// /app/api/admin/listings/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { successResponse, errorResponse } from "@/lib/response";
import { adminMiddleware } from "@/middleware/adminMiddleware";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const updateData = await request.json();

    // Validate the update data
    const allowedFields = [
      "isActive",
      "isVerified",
      "isFeatured",
      "isPremium",
      "status",
    ];
    const updateFields = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (
          key === "status" &&
          !["pending", "approved", "rejected", "archived"].includes(value)
        ) {
          return errorResponse("Invalid status value", 400);
        }
        if (
          ["isActive", "isVerified", "isFeatured", "isPremium"].includes(key) &&
          typeof value !== "boolean"
        ) {
          return errorResponse(`${key} must be a boolean`, 400);
        }
        updateFields[key] = value;
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return errorResponse("No valid fields to update", 400);
    }

    // Auto-approve when admin verifies a listing
    if (updateFields.isVerified === true && !updateFields.status) {
      updateFields.status = "approved";
    }

    // Auto-deactivate when rejecting a listing
    if (updateFields.status === "rejected" && updateFields.isActive !== false) {
      updateFields.isActive = false;
    }

    const listing = await Listing.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).populate("userId", "name email");

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    return successResponse(listing, `Listing updated successfully`);
  } catch (error) {
    console.error("Update listing error:", error);
    return errorResponse("Failed to update listing", 500);
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;

    const listing = await Listing.findById(id)
      .populate("userId", "name email role phone")
      .lean();

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    return successResponse(listing, "Listing details retrieved successfully");
  } catch (error) {
    console.error("Get listing details error:", error);
    return errorResponse("Failed to retrieve listing details", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;

    const listing = await Listing.findById(id);
    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    // Delete the listing
    await Listing.findByIdAndDelete(id);

    return successResponse(null, "Listing deleted successfully");
  } catch (error) {
    console.error("Delete listing error:", error);
    return errorResponse("Failed to delete listing", 500);
  }
}
