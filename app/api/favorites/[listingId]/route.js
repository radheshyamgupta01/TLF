import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

// DELETE /api/favorites/[listingId] - Remove from favorites
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { listingId } = params;

    const favorite = await Favorite.findOneAndDelete({
      userId: authResult.user._id,
      listingId,
    });

    if (!favorite) {
      return errorResponse("Favorite not found", 404);
    }

    return successResponse(null, "Removed from favorites successfully");
  } catch (error) {
    console.error("Remove from favorites error:", error);
    return errorResponse("Failed to remove from favorites", 500);
  }
}

// GET /api/favorites/[listingId] - Check if listing is in favorites
export async function GET(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { listingId } = params;

    const favorite = await Favorite.findOne({
      userId: authResult.user._id,
      listingId,
    });

    return successResponse(
      {
        isFavorite: !!favorite,
      },
      "Favorite status retrieved successfully"
    );
  } catch (error) {
    console.error("Check favorite error:", error);
    return errorResponse("Failed to check favorite status", 500);
  }
}
