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
    const days = parseInt(searchParams.get("days")) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get listings analytics
    const analytics = await Listing.aggregate([
      {
        $match: {
          userId: authResult.user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
          views: { $sum: "$views" },
          inquiries: { $sum: "$inquiries" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    // Get property type distribution
    const propertyTypeStats = await Listing.aggregate([
      {
        $match: {
          userId: authResult.user._id,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$propertyType",
          count: { $sum: 1 },
          totalViews: { $sum: "$views" },
          totalInquiries: { $sum: "$inquiries" },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get top performing listings
    const topListings = await Listing.find({
      userId: authResult.user._id,
      isActive: true,
    })
      .sort({ views: -1 })
      .limit(5)
      .select("title propertyType views inquiries price createdAt")
      .lean();

    return successResponse(
      {
        dailyStats: analytics,
        propertyTypeStats,
        topListings,
        period: `${days} days`,
      },
      "Listing reports retrieved successfully"
    );
  } catch (error) {
    console.error("Get listing reports error:", error);
    return errorResponse("Failed to retrieve listing reports", 500);
  }
}
