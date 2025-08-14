// /app/api/users/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/lib/response";
import Listing from "@/models/Listing";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Build filter object - only active agents
    const filter = {
      isActive: true,
      role: { $in: ["seller", "broker", "developer"] }, // Include both agents and developers
    };

    // Featured filter
    const featured = searchParams.get("featured");
    if (featured === "true") {
      filter.isFeatured = true;
    }

    // Location filters
    const city = searchParams.get("city");
    if (city) {
      filter.city = new RegExp(city, "i");
    }

    const state = searchParams.get("state");
    if (state) {
      filter.state = new RegExp(state, "i");
    }

    // Search in name and email
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    // Specialization filter (if you have this field in User model)
    const specialization = searchParams.get("specialization");
    if (specialization) {
      filter.specialization = new RegExp(specialization, "i");
    }

    // Sorting
    const sort = searchParams.get("sort") || "rating";
    let sortObj = {};

    switch (sort) {
      case "rating":
        sortObj = { rating: -1, totalReviews: -1 };
        break;
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "experience":
        sortObj = { experience: -1 };
        break;
      case "name":
        sortObj = { name: 1 };
        break;
      default:
        sortObj = { rating: -1, totalReviews: -1 };
    }

    // Execute query
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -__v -email -phone") // Exclude sensitive fields
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    // const propertiesCount = await Listing.countDocuments({
    //   userId: id,
    //   isActive: true,
    // });

    // Get properties count for all users in one query
    const userIds = users.map((user) => user._id);
    const propertiesCounts = await Listing.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map for quick lookup
    const countMap = propertiesCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    // Add additional computed fields for agents
    const enhancedUsers = users.map((user) => ({
      ...user,
      // Add any computed fields here if needed
      displayName: user.name || "Anonymous Agent",
      verified: user.verified || false,
      rating: user.rating || 0,
      totalReviews: user.totalReviews || 0,
      propertiesCount: countMap[user._id.toString()] || 0,
    }));

    return successResponse(
      {
        users: enhancedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          total: total,
          hasMore: page < totalPages,
          limit,
          skip,
        },
      },
      "Agents retrieved successfully"
    );
  } catch (error) {
    console.error("Get agents error:", error);
    return errorResponse("Failed to retrieve agents", 500);
  }
}
