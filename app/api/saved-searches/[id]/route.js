import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const body = await request.json();

    const savedSearch = await SavedSearch.findOne({
      _id: id,
      userId: authResult.user._id,
    });

    if (!savedSearch) {
      return errorResponse("Saved search not found", 404);
    }

    // Update saved search
    Object.keys(body).forEach((key) => {
      if (body[key] !== undefined) {
        savedSearch[key] = body[key];
      }
    });

    await savedSearch.save();

    return successResponse(savedSearch, "Saved search updated successfully");
  } catch (error) {
    console.error("Update saved search error:", error);
    return errorResponse("Failed to update saved search", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;

    const savedSearch = await SavedSearch.findOneAndDelete({
      _id: id,
      userId: authResult.user._id,
    });

    if (!savedSearch) {
      return errorResponse("Saved search not found", 404);
    }

    return successResponse(null, "Saved search deleted successfully");
  } catch (error) {
    console.error("Delete saved search error:", error);
    return errorResponse("Failed to delete saved search", 500);
  }
}
