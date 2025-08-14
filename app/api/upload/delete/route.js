import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/authMiddleware";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/response";

export async function DELETE(request) {
  try {
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return errorResponse("Public ID is required", 400);
    }

    await deleteFromCloudinary(publicId);

    return successResponse(null, "Image deleted successfully");
  } catch (error) {
    console.error("Delete image error:", error);
    return errorResponse("Failed to delete image", 500);
  }
}
