import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

export async function DELETE(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Deactivate user listings
    await Listing.updateMany(
      { userId: authResult.user._id },
      { isActive: false }
    );

    // Deactivate user account
    await User.findByIdAndUpdate(authResult.user._id, { isActive: false });

    return successResponse(null, "Account deleted successfully");
  } catch (error) {
    console.error("Delete account error:", error);
    return errorResponse("Failed to delete account", 500);
  }
}
