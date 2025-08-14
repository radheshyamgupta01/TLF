import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: authResult.user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return errorResponse("Notification not found", 404);
    }

    return successResponse(notification, "Notification marked as read");
  } catch (error) {
    console.error("Mark notification as read error:", error);
    return errorResponse("Failed to mark notification as read", 500);
  }
}
