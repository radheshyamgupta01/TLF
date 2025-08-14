import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import { validateRequired } from "@/lib/validations";

export async function GET(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const savedSearches = await SavedSearch.find({
      userId: authResult.user._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse(
      savedSearches,
      "Saved searches retrieved successfully"
    );
  } catch (error) {
    console.error("Get saved searches error:", error);
    return errorResponse("Failed to retrieve saved searches", 500);
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body = await request.json();

    const requiredFields = ["name", "searchCriteria"];
    const missingFields = validateRequired(requiredFields, body);

    if (missingFields.length > 0) {
      return errorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const { name, searchCriteria, alertEnabled } = body;

    // Check if user already has a saved search with this name
    const existingSearch = await SavedSearch.findOne({
      userId: authResult.user._id,
      name: name.trim(),
    });

    if (existingSearch) {
      return errorResponse("A saved search with this name already exists", 409);
    }

    const savedSearch = new SavedSearch({
      userId: authResult.user._id,
      name: name.trim(),
      searchCriteria,
      alertEnabled: alertEnabled !== undefined ? alertEnabled : true,
    });

    await savedSearch.save();

    return successResponse(
      savedSearch,
      "Saved search created successfully",
      201
    );
  } catch (error) {
    console.error("Create saved search error:", error);
    return errorResponse("Failed to create saved search", 500);
  }
}
