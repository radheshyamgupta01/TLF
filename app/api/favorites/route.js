import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

// GET /api/favorites - Get user's favorite listings
export async function GET(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ userId: authResult.user._id })
        .populate({
          path: "listingId",
          populate: {
            path: "userId",
            select: "name email phone avatar",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Favorite.countDocuments({ userId: authResult.user._id }),
    ]);

    // Filter out favorites where listing might be deleted
    const validFavorites = favorites.filter((fav) => fav.listingId);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        favorites: validFavorites,
        pagination: {
          currentPage: page,
          totalPages,
          totalFavorites: total,
          hasMore: page < totalPages,
        },
      },
      "Favorites retrieved successfully"
    );
  } catch (error) {
    console.error("Get favorites error:", error);
    return errorResponse("Failed to retrieve favorites", 500);
  }
}

// POST /api/favorites - Add to favorites
export async function POST(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { listingId } = await request.json();

    if (!listingId) {
      return errorResponse("Listing ID is required", 400);
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return errorResponse("Listing not found or inactive", 404);
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId: authResult.user._id,
      listingId,
    });

    if (existingFavorite) {
      return errorResponse("Listing already in favorites", 409);
    }

    // Add to favorites
    const favorite = new Favorite({
      userId: authResult.user._id,
      listingId,
    });

    await favorite.save();

    return successResponse(favorite, "Added to favorites successfully", 201);
  } catch (error) {
    console.error("Add to favorites error:", error);
    return errorResponse("Failed to add to favorites", 500);
  }
}
