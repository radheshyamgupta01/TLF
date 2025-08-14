import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import {
  validateEmail,
  validatePhone,
  validatePincode,
} from "@/lib/validations";

// GET /api/listings/[id] - Get single listing and related ones
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    // 1. Find the main listing
    const listing = await Listing.findById(id)
      .populate("userId", "name avatar")
      .select("-email -phoneNumber")
      .lean();

    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    // 2. Increment views
    await Listing.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // 3. Fetch 6 related listings
    const relatedListings = await Listing.find({
      _id: { $ne: id }, // exclude current
      city: listing.city,
      // propertyType: listing.propertyType,
    })
      .limit(6)
      .select("title price city state thumbnail") // return minimal fields
      .lean();

    return successResponse(
      { listing, relatedListings },
      "Listing and related listings retrieved successfully"
    );
  } catch (error) {
    console.error("Get listing error:", error);
    return errorResponse("Failed to retrieve listing", 500);
  }
}

// PUT /api/listings/[id] - Update listing
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const body = await request.json();

    // Find listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    // Check ownership
    if (listing.userId.toString() !== authResult.user._id.toString()) {
      return errorResponse("Not authorized to update this listing", 403);
    }

    // Validate email and phone if provided
    if (body.email && !validateEmail(body.email)) {
      return errorResponse("Invalid email format", 400);
    }

    if (body.phoneNumber && !validatePhone(body.phoneNumber)) {
      return errorResponse("Invalid phone number format", 400);
    }

    if (body.pincode && !validatePincode(body.pincode)) {
      return errorResponse("Invalid pincode format", 600);
    }

    // Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone avatar");

    return successResponse(updatedListing, "Listing updated successfully");
  } catch (error) {
    console.error("Update listing error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse("Validation failed", 400, errors);
    }
    return errorResponse("Failed to update listing", 500);
  }
}

// DELETE /api/listings/[id] - Delete listing
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;

    // Find listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return errorResponse("Listing not found", 404);
    }

    // Check ownership
    if (listing.userId.toString() !== authResult.user._id.toString()) {
      return errorResponse("Not authorized to delete this listing", 403);
    }

    // Soft delete by setting isActive to false
    await Listing.findByIdAndUpdate(id, { isActive: false });

    return successResponse(null, "Listing deleted successfully");
  } catch (error) {
    console.error("Delete listing error:", error);
    return errorResponse("Failed to delete listing", 500);
  }
}
