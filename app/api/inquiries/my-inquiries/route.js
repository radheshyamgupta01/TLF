import connectDB from "@/lib/mongoose";
import Inquiry from "@/models/Inquiry";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";

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
