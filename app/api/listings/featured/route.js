import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 8;

    const featuredListings = await Listing.find({
      isActive: true,
      isFeatured: true,
    })
      .populate("userId", "name email phone avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(
      featuredListings,
      "Featured listings retrieved successfully"
    );
  } catch (error) {
    console.error("Get featured listings error:", error);
    return errorResponse("Failed to retrieve featured listings", 500);
  }
}
