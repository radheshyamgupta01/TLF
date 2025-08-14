// /app/api/admin/users/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { adminMiddleware } from "@/middleware/adminMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

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
    const allowedFields = ["isActive", "isVerified", "isFeatured", "role"];
    const updateFields = {};

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === "role" && !["user", "agent", "admin"].includes(value)) {
          return errorResponse("Invalid role value", 400);
        }
        if (
          ["isActive", "isVerified", "isFeatured"].includes(key) &&
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

    // Prevent admin from deactivating themselves
    if (updateFields.isActive === false && id === authResult.user.id) {
      return errorResponse("Cannot deactivate your own account", 400);
    }

    // Prevent admin from removing their own admin role
    if (
      updateFields.role &&
      updateFields.role !== "admin" &&
      id === authResult.user.id
    ) {
      return errorResponse("Cannot change your own admin role", 400);
    }

    const user = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).select("-password");

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // If deactivating user, also deactivate their listings
    if (updateFields.isActive === false) {
      await Listing.updateMany({ userId: id }, { isActive: false });
    }

    // If removing featured status from user, remove featured status from their listings
    if (updateFields.isFeatured === false) {
      await Listing.updateMany({ userId: id }, { isFeatured: false });
    }

    return successResponse(user, `User updated successfully`);
  } catch (error) {
    console.error("Update user error:", error);
    return errorResponse("Failed to update user", 500);
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

    const user = await User.findById(id)
      .select("-password")
      .populate("listings", "title status createdAt")
      .lean();

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Get user statistics
    const [totalListings, activeListings, featuredListings] = await Promise.all(
      [
        Listing.countDocuments({ userId: id }),
        Listing.countDocuments({ userId: id, isActive: true }),
        Listing.countDocuments({ userId: id, isFeatured: true }),
      ]
    );

    const userWithStats = {
      ...user,
      stats: {
        totalListings,
        activeListings,
        featuredListings,
      },
    };

    return successResponse(
      userWithStats,
      "User details retrieved successfully"
    );
  } catch (error) {
    console.error("Get user details error:", error);
    return errorResponse("Failed to retrieve user details", 500);
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

    // Prevent admin from deleting themselves
    if (id === authResult.user.id) {
      return errorResponse("Cannot delete your own account", 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Delete user's listings first
    await Listing.deleteMany({ userId: id });

    // Delete the user
    await User.findByIdAndDelete(id);

    return successResponse(null, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse("Failed to delete user", 500);
  }
}
