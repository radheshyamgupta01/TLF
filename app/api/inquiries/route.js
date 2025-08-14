import connectDB from "@/lib/mongoose";
import Listing from "@/models/Listing";
import Inquiry from "@/models/Inquiry";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import {
  validateRequired,
  validateEmail,
  validatePhone,
} from "@/lib/validations";

// POST /api/inquiries - Create new inquiry
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      // "listingId",
      "inquirerName",
      "inquirerEmail",
      "inquirerPhone",
    ];
    const missingFields = validateRequired(requiredFields, body);

    if (missingFields.length > 0) {
      return errorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const {
      listingId,
      inquirerName,
      inquirerEmail,
      inquirerPhone,
      message = "",
    } = body;

    // Validate and sanitize inputs
    const trimmedName = inquirerName.trim();
    const trimmedEmail = inquirerEmail.toLowerCase().trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      return errorResponse("Name must be at least 2 characters long", 400);
    }

    if (!validateEmail(trimmedEmail)) {
      return errorResponse("Invalid email format", 400);
    }

    if (!validatePhone(inquirerPhone)) {
      return errorResponse("Invalid phone number format", 400);
    }

    if (trimmedMessage.length > 1000) {
      return errorResponse("Message cannot exceed 1000 characters", 400);
    }

    let listing = null;
    let listingOwnerId = null;

    // Check if listing exists and is active (only if listingId is provided)
    if (listingId) {
      listing = await Listing.findById(listingId);
      if (!listing || !listing.isActive) {
        return errorResponse("Listing not found or inactive", 404);
      }
      listingOwnerId = listing.userId;
    }

    // Get inquirer user ID if authenticated
    let inquirerUserId = null;
    const authResult = await authMiddleware(request);
    if (!authResult.error) {
      inquirerUserId = authResult.user._id;
    }

    // console.log(authResult);
    // Check for duplicate inquiry (only if listingId is provided)
    if (listingId) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existingInquiry = await Inquiry.findOne({
        listingId,
        inquirerEmail: trimmedEmail,
        createdAt: { $gte: twentyFourHoursAgo },
      });

      if (existingInquiry) {
        return errorResponse(
          "You have already inquired about this property recently",
          429
        );
      }
    }

    // Create inquiry
    const inquiry = new Inquiry({
      listingId: listingId || null,
      inquirerName: trimmedName,
      inquirerEmail: trimmedEmail,
      inquirerPhone,
      message: trimmedMessage,
      inquirerUserId,
      listingOwnerId,
    });

    await inquiry.save();

    // Increment inquiry count on listing (only if listing exists)
    if (listingId && listing) {
      await Listing.findByIdAndUpdate(
        listingId,
        { $inc: { inquiries: 1 } },
        { new: true }
      );
    }

    // Populate listing data for response (only if listingId exists)
    if (listingId) {
      await inquiry.populate(
        "listingId",
        "title propertyType listingType price"
      );
    }

    // Remove sensitive data from response
    const responseData = {
      _id: inquiry._id,
      inquirerName: inquiry.inquirerName,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt,
      listingId: inquiry.listingId,
    };

    return successResponse(responseData, "Inquiry sent successfully", 201);
  } catch (error) {
    console.error("Create inquiry error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse("Validation failed", 400, { errors });
    }

    if (error.name === "CastError") {
      return errorResponse("Invalid listing ID format", 400);
    }

    return errorResponse("Failed to send inquiry", 500);
  }
}

// GET /api/inquiries - Get user's inquiries (received)
export async function GET(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit")) || 10)
    );
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const type = searchParams.get("type");

    // console.log(authResult);

    const filter = {};

    if (type === "general") {
      // For general inquiries (from developer page)
      filter.listingOwnerId = null;
    } else if (type === "listing") {
      // For listing-specific inquiries
      filter.listingOwnerId = authResult.user._id;
      filter.listingId = { $ne: null }; // Ensure listingId exists
    } else {
      // Default: get all inquiries for the authenticated user
      filter.$or = [
        { listingOwnerId: authResult.user._id }, // Inquiries for user's listings
        { listingOwnerId: null }, // General inquiries (you might want to restrict this based on user role)
      ];
    }

    if (
      status &&
      ["new", "contacted", "interested", "not-interested", "closed"].includes(
        status
      )
    ) {
      filter.status = status;
    }

    // Build filter
    // const filter = { listingOwnerId: authResult.user._id };
    // if (
    //   status &&
    //   ["new", "contacted", "interested", "not-interested", "closed"].includes(
    //     status
    //   )
    // ) {
    //   filter.status = status;
    // }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate("listingId", "title propertyType listingType price images")
        .populate("inquirerUserId", "name")
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        inquiries,
        pagination: {
          currentPage: page,
          totalPages,
          totalInquiries: total,
          hasMore: page < totalPages,
          limit,
        },
        filter: { type, status },
      },
      "Inquiries retrieved successfully"
    );
  } catch (error) {
    console.error("Get inquiries error:", error);
    return errorResponse("Failed to retrieve inquiries", 500);
  }
}

// PATCH /api/inquiries/[id] - Update inquiry status
export async function PATCH(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { pathname } = new URL(request.url);
    const inquiryId = pathname.split("/").pop();

    if (!inquiryId) {
      return errorResponse("Inquiry ID is required", 400);
    }

    const { status } = await request.json();

    if (
      !status ||
      !["new", "contacted", "interested", "not-interested", "closed"].includes(
        status
      )
    ) {
      return errorResponse("Invalid status", 400);
    }

    // Find and update inquiry (only if user owns the listing)
    const inquiry = await Inquiry.findOneAndUpdate(
      {
        _id: inquiryId,
        listingOwnerId: authResult.user._id,
      },
      { status },
      { new: true }
    ).populate("listingId", "title");

    if (!inquiry) {
      return errorResponse("Inquiry not found or unauthorized", 404);
    }

    return successResponse(inquiry, "Inquiry status updated successfully");
  } catch (error) {
    console.error("Update inquiry error:", error);

    if (error.name === "CastError") {
      return errorResponse("Invalid inquiry ID format", 400);
    }

    return errorResponse("Failed to update inquiry", 500);
  }
}
