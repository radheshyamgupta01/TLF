// utils/inquiryUtils.js

import Inquiry from "@/models/Inquiry";
import Listing from "@/models/Listing";

/**
 * Check if a user has already inquired about a listing recently
 * @param {string} email - Inquirer's email
 * @param {string} listingId - Listing ID
 * @param {number} hours - Hours to check back (default: 24)
 * @returns {Promise<boolean>}
 */
export const hasRecentInquiry = async (email, listingId, hours = 24) => {
  try {
    const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
    const existingInquiry = await Inquiry.findOne({
      inquirerEmail: email.toLowerCase().trim(),
      listingId,
      createdAt: { $gte: timeAgo },
    });

    return !!existingInquiry;
  } catch (error) {
    console.error("Error checking recent inquiry:", error);
    return false;
  }
};

/**
 * Get inquiry statistics for a listing owner
 * @param {string} userId - Listing owner's user ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Object>}
 */
export const getInquiryStats = async (userId, days = 30) => {
  try {
    const stats = await Inquiry.getStats(userId, days);

    // Calculate conversion rates
    const conversionRate =
      stats.total > 0 ? (stats.closed / stats.total) * 100 : 0;
    const responseRate =
      stats.total > 0
        ? ((stats.contacted + stats.interested + stats.closed) / stats.total) *
          100
        : 0;

    return {
      ...stats,
      conversionRate: Math.round(conversionRate * 100) / 100,
      responseRate: Math.round(responseRate * 100) / 100,
      averageResponseTimeHours: stats.averageResponseTime
        ? Math.round((stats.averageResponseTime / (1000 * 60 * 60)) * 100) / 100
        : null,
    };
  } catch (error) {
    console.error("Error getting inquiry stats:", error);
    return null;
  }
};

/**
 * Create a new inquiry with validation and duplicate checking
 * @param {Object} inquiryData - Inquiry data
 * @returns {Promise<Object>}
 */
export const createInquiry = async (inquiryData) => {
  try {
    const {
      listingId,
      inquirerName,
      inquirerEmail,
      inquirerPhone,
      message = "",
      inquirerUserId = null,
      source = "web",
      metadata = {},
    } = inquiryData;

    // Validate and sanitize inputs
    const trimmedName = inquirerName.trim();
    const trimmedEmail = inquirerEmail.toLowerCase().trim();
    const trimmedMessage = message.trim();
    const cleanPhone = inquirerPhone.replace(/\D/g, "");

    // Check if listing exists and is active
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      throw new Error("Listing not found or inactive");
    }

    // Check for recent duplicate inquiry
    const hasRecent = await hasRecentInquiry(trimmedEmail, listingId);
    if (hasRecent) {
      throw new Error("You have already inquired about this property recently");
    }

    // Create inquiry
    const inquiry = new Inquiry({
      listingId,
      inquirerName: trimmedName,
      inquirerEmail: trimmedEmail,
      inquirerPhone: cleanPhone,
      message: trimmedMessage,
      inquirerUserId,
      listingOwnerId: listing.userId,
      source,
      metadata,
    });

    await inquiry.save();

    // Increment inquiry count on listing
    await Listing.findByIdAndUpdate(
      listingId,
      { $inc: { inquiries: 1 } },
      { new: true }
    );

    // Populate listing data
    await inquiry.populate("listingId", "title propertyType listingType price");

    return {
      success: true,
      inquiry,
      message: "Inquiry sent successfully",
    };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send inquiry",
    };
  }
};

/**
 * Update inquiry status with validation
 * @param {string} inquiryId - Inquiry ID
 * @param {string} status - New status
 * @param {string} userId - User ID (must be listing owner)
 * @param {string} response - Optional response message
 * @returns {Promise<Object>}
 */
export const updateInquiryStatus = async (
  inquiryId,
  status,
  userId,
  response = null
) => {
  try {
    const validStatuses = [
      "new",
      "contacted",
      "interested",
      "not-interested",
      "closed",
    ];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const updateData = { status };
    if (response && status === "contacted") {
      updateData.response = response.trim();
      updateData.respondedAt = new Date();
    }

    const inquiry = await Inquiry.findOneAndUpdate(
      {
        _id: inquiryId,
        listingOwnerId: userId,
      },
      updateData,
      { new: true }
    ).populate("listingId", "title");

    if (!inquiry) {
      throw new Error("Inquiry not found or unauthorized");
    }

    return {
      success: true,
      inquiry,
      message: "Inquiry status updated successfully",
    };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to update inquiry",
    };
  }
};

/**
 * Get paginated inquiries for a listing owner
 * @param {string} userId - Listing owner's user ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
export const getInquiries = async (userId, options = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      listingId,
    } = options;

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Build filter
    const filter = { listingOwnerId: userId };
    if (status) filter.status = status;
    if (listingId) filter.listingId = listingId;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .populate("listingId", "title propertyType listingType price images")
        .populate("inquirerUserId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      inquiries,
      pagination: {
        currentPage: page,
        totalPages,
        totalInquiries: total,
        hasMore: page < totalPages,
        limit,
      },
    };
  } catch (error) {
    console.error("Error getting inquiries:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve inquiries",
    };
  }
};

/**
 * Get inquiries that need follow-up
 * @param {string} userId - Listing owner's user ID
 * @returns {Promise<Object>}
 */
export const getInquiriesNeedingFollowUp = async (userId) => {
  try {
    const inquiries = await Inquiry.findNeedingFollowUp(userId);

    return {
      success: true,
      inquiries,
      count: inquiries.length,
    };
  } catch (error) {
    console.error("Error getting inquiries needing follow-up:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve follow-up inquiries",
    };
  }
};

/**
 * Mark inquiry as followed up
 * @param {string} inquiryId - Inquiry ID
 * @param {string} userId - User ID (must be listing owner)
 * @returns {Promise<Object>}
 */
export const markAsFollowedUp = async (inquiryId, userId) => {
  try {
    const inquiry = await Inquiry.findOne({
      _id: inquiryId,
      listingOwnerId: userId,
    });

    if (!inquiry) {
      throw new Error("Inquiry not found or unauthorized");
    }

    if (!inquiry.canFollowUp()) {
      throw new Error("Cannot follow up on this inquiry");
    }

    await inquiry.addFollowUp();

    return {
      success: true,
      inquiry,
      message: "Follow-up recorded successfully",
    };
  } catch (error) {
    console.error("Error marking follow-up:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to record follow-up",
    };
  }
};

/**
 * Validate inquiry data
 * @param {Object} data - Inquiry data to validate
 * @returns {Object} Validation result
 */
export const validateInquiryData = (data) => {
  const errors = [];

  if (!data.inquirerName || data.inquirerName.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.inquirerEmail || !/^\S+@\S+\.\S+$/.test(data.inquirerEmail)) {
    errors.push("Please enter a valid email address");
  }

  if (
    !data.inquirerPhone ||
    !/^\d{10}$/.test(data.inquirerPhone.replace(/\D/g, ""))
  ) {
    errors.push("Please enter a valid 10-digit phone number");
  }

  if (data.message && data.message.length > 1000) {
    errors.push("Message cannot exceed 1000 characters");
  }

  if (!data.listingId) {
    errors.push("Listing ID is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  hasRecentInquiry,
  getInquiryStats,
  createInquiry,
  updateInquiryStatus,
  getInquiries,
  getInquiriesNeedingFollowUp,
  markAsFollowedUp,
  validateInquiryData,
};
