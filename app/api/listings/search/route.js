import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return errorResponse("Search query is required", 400);
    }

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Create search filter
    const searchFilter = {
      isActive: true,
      $or: [
        { title: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
        { city: new RegExp(query, "i") },
        { locality: new RegExp(query, "i") },
        { address: new RegExp(query, "i") },
      ],
    };

    const [listings, total] = await Promise.all([
      Listing.find(searchFilter)
        .populate("userId", "name email phone avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Listing.countDocuments(searchFilter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        listings,
        query,
        pagination: {
          currentPage: page,
          totalPages,
          totalListings: total,
          hasMore: page < totalPages,
        },
      },
      "Search results retrieved successfully"
    );
  } catch (error) {
    console.error("Search listings error:", error);
    return errorResponse("Failed to search listings", 500);
  }
}
