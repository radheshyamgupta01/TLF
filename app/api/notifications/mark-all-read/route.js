import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    await Notification.updateMany(
      { userId: authResult.user._id, isRead: false },
      { isRead: true }
    );

    return successResponse(null, "All notifications marked as read");
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    return errorResponse("Failed to mark all notifications as read", 500);
  }
}
