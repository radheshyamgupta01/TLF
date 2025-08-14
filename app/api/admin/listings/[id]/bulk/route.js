// /app/api/admin/listings/bulk/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { successResponse, errorResponse } from "@/lib/response";
import { adminMiddleware } from "@/middleware/adminMiddleware";

export async function PATCH(request) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { listingIds, updateData } = await request.json();

    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return errorResponse("Valid listing IDs array is required", 400);
    }

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

    // Auto-approve when admin verifies listings
    if (updateFields.isVerified === true && !updateFields.status) {
      updateFields.status = "approved";
    }

    // Auto-deactivate when rejecting listings
    if (updateFields.status === "rejected" && updateFields.isActive !== false) {
      updateFields.isActive = false;
    }

    const result = await Listing.updateMany(
      { _id: { $in: listingIds } },
      updateFields
    );

    return successResponse(
      {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      `${result.modifiedCount} listings updated successfully`
    );
  } catch (error) {
    console.error("Bulk update listings error:", error);
    return errorResponse("Failed to update listings", 500);
  }
}
