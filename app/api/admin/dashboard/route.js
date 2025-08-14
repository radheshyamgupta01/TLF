// /app/api/admin/dashboard/stats/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { adminMiddleware } from "@/middleware/adminMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

export async function GET(request) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    // Get current date for comparisons
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User Statistics
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      featuredUsers,
      newUsersThisMonth,
      usersByRole,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isFeatured: true }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Listing Statistics
    const [
      totalListings,
      activeListings,
      verifiedListings,
      featuredListings,
      premiumListings,
      newListingsThisMonth,
      listingsByStatus,
      listingsByType,
    ] = await Promise.all([
      Listing.countDocuments(),
      Listing.countDocuments({ isActive: true }),
      Listing.countDocuments({ isVerified: true }),
      Listing.countDocuments({ isFeatured: true }),
      Listing.countDocuments({ isPremium: true }),
      Listing.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Listing.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Listing.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Recent Activity (last 7 days)
    const [recentUsers, recentListings] = await Promise.all([
      User.find({ createdAt: { $gte: sevenDaysAgo } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("name email role createdAt5"),
      Listing.find({ createdAt: { $gte: sevenDaysAgo } })
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status createdAt userId"),
    ]);

    // Growth metrics (comparing with previous month)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const [usersLastMonth, listingsLastMonth] = await Promise.all([
      User.countDocuments({
        createdAt: {
          $gte: twoMonthsAgo,
          $lt: thirtyDaysAgo,
        },
      }),
      Listing.countDocuments({
        createdAt: {
          $gte: twoMonthsAgo,
          $lt: thirtyDaysAgo,
        },
      }),
    ]);

    // Calculate growth percentages
    const userGrowth =
      usersLastMonth > 0
        ? (
            ((newUsersThisMonth - usersLastMonth) / usersLastMonth) *
            100
          ).toFixed(1)
        : newUsersThisMonth > 0
        ? 100
        : 0;

    const listingGrowth =
      listingsLastMonth > 0
        ? (
            ((newListingsThisMonth - listingsLastMonth) / listingsLastMonth) *
            100
          ).toFixed(1)
        : newListingsThisMonth > 0
        ? 100
        : 0;

    // Format role data
    const roleStats = {
      admin: 0,
      agent: 0,
      user: 0,
    };
    usersByRole.forEach((item) => {
      roleStats[item._id] = item.count;
    });

    // Format status data
    const statusStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      archived: 0,
    };
    listingsByStatus.forEach((item) => {
      statusStats[item._id] = item.count;
    });

    // Format type data
    const typeStats = {};
    listingsByType.forEach((item) => {
      typeStats[item._id] = item.count;
    });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        featured: featuredUsers,
        newThisMonth: newUsersThisMonth,
        growth: parseFloat(userGrowth),
        byRole: roleStats,
      },
      listings: {
        total: totalListings,
        active: activeListings,
        verified: verifiedListings,
        featured: featuredListings,
        premium: premiumListings,
        newThisMonth: newListingsThisMonth,
        growth: parseFloat(listingGrowth),
        byStatus: statusStats,
        byType: typeStats,
      },
      activity: {
        recentUsers: recentUsers.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        })),
        recentListings: recentListings.map((listing) => ({
          id: listing._id,
          title: listing.title,
          status: listing.status,
          owner: listing.userId?.name || "Unknown",
          ownerEmail: listing.userId?.email || "",
          createdAt: listing.createdAt,
        })),
      },
    };

    return successResponse(
      stats,
      "Dashboard statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse("Failed to retrieve dashboard statistics", 500);
  }
}
