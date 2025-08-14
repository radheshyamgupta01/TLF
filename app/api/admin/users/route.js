// /app/api/admin/users/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const role = searchParams.get("role");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== null && isActive !== "") {
      filter.isActive = isActive === "true";
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasMore: page < totalPages,
        },
      },
      "Users retrieved successfully"
    );
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse("Failed to retrieve users", 500);
  }
}

// /app/api/admin/users/[id]/
