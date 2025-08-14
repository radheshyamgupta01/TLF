import connectDB from "@/lib/mongoose";
import Inquiry from "@/models/Inquiry";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import { adminMiddleware } from "@/middleware/adminMiddleware";

// GET /api/inquiries - Get all inquiries (admin route)
export async function GET(request) {
  try {
    await connectDB();

    // Verify admin access
    const authResult = await adminMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit")) || 20)
    );
    const skip = (page - 1) * limit;

    // All available filters
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type"); // 'listing' or 'general'
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const search = searchParams.get("search"); // Search by name, email, or message
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const source = searchParams.get("source");
    const needsFollowUp = searchParams.get("needsFollowUp") === "true";
    const responded = searchParams.get("responded"); // 'true', 'false', or null for all
    const listingOwnerId = searchParams.get("listingOwnerId"); // Filter by specific listing owner
    const listingId = searchParams.get("listingId"); // Filter by specific listing

    // Build filter object
    const filter = {};

    // Type filter
    if (type === "general") {
      filter.listingOwnerId = null;
      filter.listingId = null;
    } else if (type === "listing") {
      filter.listingId = { $ne: null };
      filter.listingOwnerId = { $ne: null };
    }
    // If no type specified, show all inquiries

    // Status filter
    if (
      status &&
      ["new", "contacted", "interested", "not-interested", "closed"].includes(
        status
      )
    ) {
      filter.status = status;
    }

    // Priority filter
    if (priority && ["low", "medium", "high"].includes(priority)) {
      filter.priority = priority;
    }

    // Source filter
    if (source) {
      filter.source = source;
    }

    // Specific listing owner filter
    if (listingOwnerId) {
      filter.listingOwnerId = listingOwnerId;
    }

    // Specific listing filter
    if (listingId) {
      filter.listingId = listingId;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Set to end of day
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    // Responded filter
    if (responded === "true") {
      filter.respondedAt = { $ne: null };
    } else if (responded === "false") {
      filter.respondedAt = null;
    }

    // Needs follow-up filter
    if (needsFollowUp) {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      filter.status = { $in: ["new", "contacted"] };
      filter.createdAt = { $lte: threeDaysAgo };
      filter.followUpCount = { $lt: 3 };
      filter.respondedAt = null;
    }

    // Search filter (name, email, or message)
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { inquirerName: searchRegex },
        { inquirerEmail: searchRegex },
        { message: searchRegex },
        { inquirerPhone: searchRegex },
      ];
    }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder;

    // Execute queries
    const [inquiries, total, statusCounts, typeCounts, priorityCounts] =
      await Promise.all([
        Inquiry.find(filter)
          .populate(
            "listingId",
            "title propertyType listingType price images location"
          )
          .populate("inquirerUserId", "name email")
          .populate("listingOwnerId", "name email") // Add listing owner details
          .sort(sortObject)
          .skip(skip)
          .limit(limit)
          .lean(),
        Inquiry.countDocuments(filter),

        // Get status counts for the current filter
        Inquiry.aggregate([
          { $match: { ...filter, status: { $exists: true } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),

        // Get type counts
        Inquiry.aggregate([
          { $match: filter },
          {
            $group: {
              _id: {
                $cond: {
                  if: { $eq: ["$listingId", null] },
                  then: "general",
                  else: "listing",
                },
              },
              count: { $sum: 1 },
            },
          },
        ]),

        // Get priority counts
        Inquiry.aggregate([
          { $match: { ...filter, priority: { $exists: true } } },
          { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
      ]);

    const totalPages = Math.ceil(total / limit);

    // Format counts for easier frontend consumption
    const formatCounts = (countsArray) => {
      return countsArray.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
    };

    // Get recent activity stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentStats = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: null,
          totalRecent: { $sum: 1 },
          newRecent: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          respondedRecent: {
            $sum: { $cond: [{ $ne: ["$respondedAt", null] }, 1, 0] },
          },
          averageResponseTime: {
            $avg: {
              $cond: [
                { $ne: ["$respondedAt", null] },
                { $subtract: ["$respondedAt", "$createdAt"] },
                null,
              ],
            },
          },
        },
      },
    ]);

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
        filters: {
          status,
          priority,
          type,
          search,
          dateFrom,
          dateTo,
          source,
          needsFollowUp,
          responded,
          listingOwnerId,
          listingId,
          sortBy,
          sortOrder,
        },
        counts: {
          status: formatCounts(statusCounts),
          type: formatCounts(typeCounts),
          priority: formatCounts(priorityCounts),
        },
        stats: recentStats[0] || {
          totalRecent: 0,
          newRecent: 0,
          respondedRecent: 0,
          averageResponseTime: null,
        },
      },
      "All inquiries retrieved successfully"
    );
  } catch (error) {
    console.error("Get admin inquiries error:", error);
    return errorResponse("Failed to retrieve inquiries", 500);
  }
}
