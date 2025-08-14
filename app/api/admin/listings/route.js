// /app/api/admin/listings/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/lib/response";
import { adminMiddleware } from "@/middleware/adminMiddleware";

export async function GET(request) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const isActive = searchParams.get("isActive");
    const isVerified = searchParams.get("isVerified");
    const isFeatured = searchParams.get("isFeatured");
    const isPremium = searchParams.get("isPremium");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (isActive !== null && isActive !== "")
      filter.isActive = isActive === "true";
    if (isVerified !== null && isVerified !== "")
      filter.isVerified = isVerified === "true";
    if (isFeatured !== null && isFeatured !== "")
      filter.isFeatured = isFeatured === "true";
    if (isPremium !== null && isPremium !== "")
      filter.isPremium = isPremium === "true";
    if (userId) filter.userId = userId;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { address: new RegExp(search, "i") },
      ];
    }

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("userId", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
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
      "Listings retrieved successfully"
    );
  } catch (error) {
    console.error("Get listings error:", error);
    return errorResponse("Failed to retrieve listings", 500);
  }
}
