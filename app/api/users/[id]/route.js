// /app/api/users/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Listing from "@/models/Listing";
import Inquiry from "@/models/Inquiry";
import { successResponse, errorResponse } from "@/lib/response";
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!id) {
      return errorResponse("User ID is required", 400);
    }

    // Find user by ID
    const user = await User.findById(id)
      .select("-password -__v -email -phone") // Exclude sensitive fields
      .lean();

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Check if user is active and has appropriate role for agent listing
    if (
      !user.isActive ||
      !["seller", "broker", "developer", "admin"].includes(user.role)
    ) {
      return errorResponse("Agent not found", 404);
    }

    // Get additional statistics
    const [propertiesCount, totalInquiries, recentSales, activeListings] =
      await Promise.all([
        // Count active properties
        Listing.countDocuments({
          userId: id,
          isActive: true,
        }),

        // Count total inquiries received
        Inquiry.countDocuments({
          listingOwnerId: id,
        }),

        // Count recent sales (closed listings in last 12 months)
        Listing.countDocuments({
          userId: id,
          status: "sold",
          updatedAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
        }),

        // Get recent active listings for preview
        Listing.find({
          userId: id,
          isActive: true,
        })
          .select("title price images listingType createdAt")
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(),
      ]);

    // Calculate average response time for inquiries
    const responseTimeData = await Inquiry.aggregate([
      {
        $match: {
          listingOwnerId: user._id,
          respondedAt: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          averageResponseTime: {
            $avg: {
              $subtract: ["$respondedAt", "$createdAt"],
            },
          },
        },
      },
    ]);

    const averageResponseTimeHours =
      responseTimeData.length > 0
        ? Math.round(
            (responseTimeData[0].averageResponseTime / (1000 * 60 * 60)) * 100
          ) / 100
        : null;

    // Get inquiry statistics by status
    const inquiryStats = await Inquiry.aggregate([
      {
        $match: { listingOwnerId: user._id },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const inquiryStatusCounts = inquiryStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    // Enhanced user data
    const enhancedUser = {
      ...user,
      displayName: user.name || "Anonymous Agent",
      verified: user.verified || false,
      rating: user.rating || 0,
      totalReviews: user.totalReviews || 0,
      propertiesCount,
      totalInquiries,
      totalSales: recentSales,
      averageResponseTimeHours,
      recentListings: activeListings,
      // Add joining date
      memberSince: user.createdAt,
      // Add performance metrics
      performanceMetrics: {
        responseRate:
          totalInquiries > 0
            ? Math.round(
                ((inquiryStatusCounts.contacted ||
                  0 + inquiryStatusCounts.closed ||
                  0) /
                  totalInquiries) *
                  100
              )
            : 0,
        salesConversionRate:
          propertiesCount > 0
            ? Math.round((recentSales / propertiesCount) * 100)
            : 0,
        inquiryStatusBreakdown: inquiryStatusCounts,
      },
    };

    return successResponse(
      enhancedUser,
      "Agent details retrieved successfully"
    );
  } catch (error) {
    console.error("Get user details error:", error);

    if (error.name === "CastError") {
      return errorResponse("Invalid user ID format", 400);
    }

    return errorResponse("Failed to retrieve agent details", 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    // Authenticate user
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const userId = authResult.user._id.toString();

    // Check if user is trying to update their own profile or is admin
    if (id !== userId && authResult.user.role !== "admin") {
      return errorResponse("Unauthorized to update this profile", 403);
    }

    const body = await request.json();

    // Define allowed fields for update
    const allowedFields = [
      "name",
      "phone",
      "bio",
      "specialization",
      "experience",
      "website",
      "city",
      "state",
      "profilePicture",
      "socialMedia",
    ];

    // Filter out non-allowed fields
    const updateData = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Validate experience if provided
    if (updateData.experience !== undefined) {
      const experience = parseInt(updateData.experience);
      if (isNaN(experience) || experience < 0 || experience > 50) {
        return errorResponse(
          "Experience must be a number between 0 and 50",
          400
        );
      }
      updateData.experience = experience;
    }

    // Validate website URL if provided
    if (updateData.website && updateData.website.trim()) {
      const websiteUrl = updateData.website.trim();
      const urlPattern =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(websiteUrl)) {
        return errorResponse("Please provide a valid website URL", 400);
      }
      // Add protocol if missing
      updateData.website = websiteUrl.startsWith("http")
        ? websiteUrl
        : `https://${websiteUrl}`;
    }

    // Validate phone number if provided
    if (updateData.phone && updateData.phone.trim()) {
      const phonePattern = /^\+?[\d\s\-\(\)]+$/;
      if (!phonePattern.test(updateData.phone.trim())) {
        return errorResponse("Please provide a valid phone number", 400);
      }
    }

    // Validate social media links if provided
    if (updateData.socialMedia) {
      const validPlatforms = [
        "facebook",
        "twitter",
        "linkedin",
        "instagram",
        "youtube",
      ];
      for (const [platform, url] of Object.entries(updateData.socialMedia)) {
        if (!validPlatforms.includes(platform)) {
          return errorResponse(
            `Invalid social media platform: ${platform}`,
            400
          );
        }
        if (url && url.trim()) {
          const urlPattern = /^https?:\/\/.+/;
          if (!urlPattern.test(url.trim())) {
            return errorResponse(`Invalid URL for ${platform}`, 400);
          }
        }
      }
    }

    // Trim string fields
    ["name", "bio", "specialization", "city", "state", "phone"].forEach(
      (field) => {
        if (updateData[field] && typeof updateData[field] === "string") {
          updateData[field] = updateData[field].trim();
        }
      }
    );

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    return successResponse(updatedUser, "Profile updated successfully");
  } catch (error) {
    console.error("Update user error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse("Validation failed", 400, { errors });
    }

    if (error.name === "CastError") {
      return errorResponse("Invalid user ID format", 400);
    }

    return errorResponse("Failed to update profile", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    // Authenticate user
    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const { id } = params;
    const userId = authResult.user._id.toString();

    // Check if user is trying to delete their own profile or is admin
    if (id !== userId && authResult.user.role !== "admin") {
      return errorResponse("Unauthorized to delete this profile", 403);
    }

    // Instead of hard delete, soft delete by setting isActive to false
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return errorResponse("User not found", 404);
    }

    // Also deactivate all their listings
    await Listing.updateMany(
      { userId: id },
      {
        isActive: false,
        updatedAt: new Date(),
      }
    );

    return successResponse(
      { message: "Account deactivated successfully" },
      "Account deactivated successfully"
    );
  } catch (error) {
    console.error("Delete user error:", error);

    if (error.name === "CastError") {
      return errorResponse("Invalid user ID format", 400);
    }

    return errorResponse("Failed to deactivate account", 500);
  }
}
