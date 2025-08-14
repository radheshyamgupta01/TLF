import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Status filter
    const status = searchParams.get("status");
    const filter = { userId: authResult.user._id };

    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;

    // Sort
    const sort = { createdAt: -1 };

    const [listings, total] = await Promise.all([
      Listing.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Listing.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        listings,
        pagination: {
          currentPage: page,
          totalPages,
          totalListings: total,
          hasMore: page < totalPages,
        },
      },
      "My listings retrieved successfully"
    );
  } catch (error) {
    console.error("Get my listings error:", error);
    return errorResponse("Failed to retrieve listings", 500);
  }
}
