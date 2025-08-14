import connectDB from "@/lib/mongoose";
import User from "@/models/User"; // Assuming you have a User model
import { successResponse, errorResponse } from "@/lib/response";
import Listing from "@/models/Listing";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 8;

    // Get featured listings
    const featuredListings = await Listing.find({
      isActive: true,
      isFeatured: true,
    })
      .populate("userId", "name email phone avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get premium listings
    const premiumListings = await Listing.find({
      isActive: true,
      isPremium: true,
    })
      .populate("userId", "name email phone avatar")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get premium brokers (users with role 'broker' and isPremium true)
    const premiumBrokers = await User.find({
      role: { $in: ["buyer", "broker", "developer"] },
      isFeatured: true,
      isActive: true, // Assuming you have an isActive field for users
    })
      .select(
        "name role company profession licenseno experience bio specialties address avatar"
      )
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Prepare response data
    const homeData = {
      featuredListings: featuredListings || [],
      premiumListings: premiumListings || [],
      premiumBrokers: premiumBrokers || [],
      stats: {
        totalFeatured: featuredListings?.length || 0,
        totalPremium: premiumListings?.length || 0,
        totalPremiumBrokers: premiumBrokers?.length || 0,
      },
    };

    // console.log(homeData);

    return successResponse(homeData, "Home data retrieved successfully");
  } catch (error) {
    console.error("Get home data error:", error);
    return errorResponse("Failed to retrieve home data", 500);
  }
}
