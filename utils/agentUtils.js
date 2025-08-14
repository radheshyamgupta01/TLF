// utils/agentUtils.js

import User from "@/models/User";
import Listing from "@/models/Listing";
import Inquiry from "@/models/Inquiry";

/**
 * Get agent statistics
 * @param {string} agentId - Agent's user ID
 * @returns {Promise<Object>}
 */
export const getAgentStats = async (agentId) => {
  try {
    const [
      activeListings,
      totalListings,
      soldListings,
      totalInquiries,
      responseStats,
      recentActivity,
    ] = await Promise.all([
      // Active listings count
      Listing.countDocuments({ userId: agentId, isActive: true }),

      // Total listings ever created
      Listing.countDocuments({ userId: agentId }),

      // Sold listings in last 12 months
      Listing.countDocuments({
        userId: agentId,
        status: "sold",
        updatedAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      }),

      // Total inquiries received
      Inquiry.countDocuments({ listingOwnerId: agentId }),

      // Response time statistics
      Inquiry.aggregate([
        {
          $match: {
            listingOwnerId: agentId,
            respondedAt: { $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            avgResponseTime: {
              $avg: { $subtract: ["$respondedAt", "$createdAt"] },
            },
            totalResponded: { $sum: 1 },
          },
        },
      ]),

      // Recent activity (last 30 days)
      Promise.all([
        Listing.countDocuments({
          userId: agentId,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
        Inquiry.countDocuments({
          listingOwnerId: agentId,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
      ]),
    ]);

    const [newListingsLast30Days, newInquiriesLast30Days] = recentActivity;
    const responseData = responseStats[0] || {
      avgResponseTime: null,
      totalResponded: 0,
    };

    return {
      listings: {
        active: activeListings,
        total: totalListings,
        sold: soldListings,
        newLast30Days: newListingsLast30Days,
      },
      inquiries: {
        total: totalInquiries,
        responded: responseData.totalResponded,
        newLast30Days: newInquiriesLast30Days,
        responseRate:
          totalInquiries > 0
            ? Math.round((responseData.totalResponded / totalInquiries) * 100)
            : 0,
      },
      performance: {
        averageResponseTimeHours: responseData.avgResponseTime
          ? Math.round(
              (responseData.avgResponseTime / (1000 * 60 * 60)) * 100
            ) / 100
          : null,
        conversionRate:
          activeListings > 0
            ? Math.round((soldListings / activeListings) * 100)
            : 0,
      },
    };
  } catch (error) {
    console.error("Error getting agent stats:", error);
    throw error;
  }
};

/**
 * Get top performing agents
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export const getTopAgents = async (options = {}) => {
  try {
    const {
      limit = 10,
      period = 30, // days
      city,
      state,
      specialization,
    } = options;

    const matchConditions = {
      isActive: true,
      role: { $in: ["buyer", "broker", "developer", "admin"] },
    };

    if (city) matchConditions.city = new RegExp(city, "i");
    if (state) matchConditions.state = new RegExp(state, "i");
    if (specialization)
      matchConditions.specialization = new RegExp(specialization, "i");

    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    const agents = await User.aggregate([
      { $match: matchConditions },
      {
        $lookup: {
          from: "listings",
          localField: "_id",
          foreignField: "userId",
          as: "listings",
        },
      },
      {
        $lookup: {
          from: "inquiries",
          localField: "_id",
          foreignField: "listingOwnerId",
          as: "inquiries",
        },
      },
      {
        $addFields: {
          activeListings: {
            $size: {
              $filter: {
                input: "$listings",
                cond: { $eq: ["$$this.isActive", true] },
              },
            },
          },
          recentSales: {
            $size: {
              $filter: {
                input: "$listings",
                cond: {
                  $and: [
                    { $eq: ["$$this.status", "sold"] },
                    { $gte: ["$$this.updatedAt", startDate] },
                  ],
                },
              },
            },
          },
          totalInquiries: { $size: "$inquiries" },
          recentInquiries: {
            $size: {
              $filter: {
                input: "$inquiries",
                cond: { $gte: ["$$this.createdAt", startDate] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          performanceScore: {
            $add: [
              { $multiply: ["$rating", 20] },
              { $multiply: ["$recentSales", 15] },
              { $multiply: ["$activeListings", 5] },
              { $multiply: ["$recentInquiries", 2] },
            ],
          },
        },
      },
      {
        $project: {
          password: 0,
          __v: 0,
          listings: 0,
          inquiries: 0,
        },
      },
      { $sort: { performanceScore: -1, rating: -1 } },
      { $limit: limit },
    ]);

    return agents;
  } catch (error) {
    console.error("Error getting top agents:", error);
    throw error;
  }
};

/**
 * Search agents with filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Object>}
 */
export const searchAgents = async (filters = {}) => {
  try {
    const {
      search,
      city,
      state,
      specialization,
      featured,
      minRating,
      sort = "rating",
      page = 1,
      limit = 12,
    } = filters;

    const skip = (page - 1) * limit;

    // Build match conditions
    const matchConditions = {
      isActive: true,
      role: { $in: ["buyer", "broker", "developer", "admin"] },
    };

    if (search) {
      matchConditions.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { specialization: new RegExp(search, "i") },
      ];
    }

    if (city) matchConditions.city = new RegExp(city, "i");
    if (state) matchConditions.state = new RegExp(state, "i");
    if (specialization)
      matchConditions.specialization = new RegExp(specialization, "i");
    if (featured === "true") matchConditions.isFeatured = true;
    if (minRating) matchConditions.rating = { $gte: parseFloat(minRating) };

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case "rating":
        sortObj = { rating: -1, totalReviews: -1 };
        break;
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "experience":
        sortObj = { experience: -1 };
        break;
      case "name":
        sortObj = { name: 1 };
        break;
      case "properties":
        sortObj = { propertiesCount: -1 };
        break;
      default:
        sortObj = { rating: -1, totalReviews: -1 };
    }

    const [agents, total] = await Promise.all([
      User.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: "listings",
            localField: "_id",
            foreignField: "userId",
            as: "listings",
          },
        },
        {
          $addFields: {
            propertiesCount: {
              $size: {
                $filter: {
                  input: "$listings",
                  cond: { $eq: ["$$this.isActive", true] },
                },
              },
            },
          },
        },
        {
          $project: {
            password: 0,
            __v: 0,
            listings: 0,
          },
        },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limit },
      ]),
      User.countDocuments(matchConditions),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      agents,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        hasMore: page < totalPages,
        limit,
      },
    };
  } catch (error) {
    console.error("Error searching agents:", error);
    throw error;
  }
};

/**
 * Get agent's recent activities
 * @param {string} agentId - Agent's user ID
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>}
 */
export const getAgentActivities = async (agentId, days = 30) => {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [recentListings, recentInquiries] = await Promise.all([
      Listing.find({
        userId: agentId,
        createdAt: { $gte: startDate },
      })
        .select("title price createdAt status listingType")
        .sort({ createdAt: -1 })
        .lean(),

      Inquiry.find({
        listingOwnerId: agentId,
        createdAt: { $gte: startDate },
      })
        .populate("listingId", "title")
        .select("inquirerName createdAt status listingId")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Combine and sort activities
    const activities = [
      ...recentListings.map((listing) => ({
        type: "listing",
        action: "created",
        data: listing,
        date: listing.createdAt,
      })),
      ...recentInquiries.map((inquiry) => ({
        type: "inquiry",
        action: "received",
        data: inquiry,
        date: inquiry.createdAt,
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return activities;
  } catch (error) {
    console.error("Error getting agent activities:", error);
    throw error;
  }
};

/**
 * Update agent rating based on reviews
 * @param {string} agentId - Agent's user ID
 * @returns {Promise<Object>}
 */
export const updateAgentRating = async (agentId) => {
  try {
    // This would typically be called after a review is added/updated
    // For now, we'll just return a placeholder since we don't have a reviews collection
    // In a real implementation, you would:
    // 1. Calculate average rating from reviews collection
    // 2. Count total reviews
    // 3. Update the user document

    const agent = await User.findById(agentId);
    if (!agent) {
      throw new Error("Agent not found");
    }

    // Placeholder calculation - replace with actual review aggregation
    const updatedAgent = await User.findByIdAndUpdate(
      agentId,
      {
        // rating: calculatedRating,
        // totalReviews: reviewCount,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password -__v");

    return updatedAgent;
  } catch (error) {
    console.error("Error updating agent rating:", error);
    throw error;
  }
};

/**
 * Get agents by location
 * @param {Object} location - Location filters
 * @returns {Promise<Array>}
 */
export const getAgentsByLocation = async (location = {}) => {
  try {
    const { city, state, radius } = location;

    const matchConditions = {
      isActive: true,
      role: { $in: ["buyer", "broker", "developer", "admin"] },
    };

    if (city) matchConditions.city = new RegExp(city, "i");
    if (state) matchConditions.state = new RegExp(state, "i");

    const agents = await User.find(matchConditions)
      .select("-password -__v")
      .sort({ rating: -1, totalReviews: -1 })
      .limit(20)
      .lean();

    return agents;
  } catch (error) {
    console.error("Error getting agents by location:", error);
    throw error;
  }
};

export default {
  getAgentStats,
  getTopAgents,
  searchAgents,
  getAgentActivities,
  updateAgentRating,
  getAgentsByLocation,
};
