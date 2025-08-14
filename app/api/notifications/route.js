import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
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
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const filter = {
      userId: authResult.user._id,
      isActive: true,
    };

    if (unreadOnly) {
      filter.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({
        userId: authResult.user._id,
        isRead: false,
        isActive: true,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        notifications,
        unreadCount,
        pagination: {
          currentPage: page,
          totalPages,
          totalNotifications: total,
          hasMore: page < totalPages,
        },
      },
      "Notifications retrieved successfully"
    );
  } catch (error) {
    console.error("Get notifications error:", error);
    return errorResponse("Failed to retrieve notifications", 500);
  }
}
