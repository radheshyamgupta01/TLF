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

    return successResponse(
      authResult.user,
      "User profile retrieved successfully"
    );
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse("Failed to get user profile", 500);
  }
}
