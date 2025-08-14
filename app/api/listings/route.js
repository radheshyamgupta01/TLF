import connectDB from "@/lib/mongoose";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import {
  validateRequired,
  validateEmail,
  validatePhone,
  validatePincode,
} from "@/lib/validations";
import Listing from "@/models/Listing";

// GET /api/listings - Get all listings with comprehensive filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Build filter object
    const filter = { isActive: true };

    // Location filters
    if (searchParams.get("city"))
      filter.city = new RegExp(searchParams.get("city"), "i");
    if (searchParams.get("state"))
      filter.state = new RegExp(searchParams.get("state"), "i");
    if (searchParams.get("locality"))
      filter.locality = new RegExp(searchParams.get("locality"), "i");

    // Property type and listing type
    if (searchParams.get("propertyType"))
      filter.propertyType = searchParams.get("propertyType");
    if (searchParams.get("listingType"))
      filter.listingType = searchParams.get("listingType");

    // Property features
    if (searchParams.get("furnishing"))
      filter.furnishing = searchParams.get("furnishing");

    // Status filters
    if (searchParams.get("isVerified") === "true") filter.isVerified = true;
    if (searchParams.get("isFeatured") === "true") filter.isFeatured = true;
    if (searchParams.get("premium") === "true") filter.isPremium = true;

    // User type filter
    if (searchParams.get("userType"))
      filter.userType = searchParams.get("userType");

    // Price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && minPrice !== "") filter.price.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== "") filter.price.$lte = Number(maxPrice);
    }

    // Area range
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea && minArea !== "") filter.area.$gte = Number(minArea);
      if (maxArea && maxArea !== "") filter.area.$lte = Number(maxArea);
    }

    // Bedrooms filter with 4+ support
    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms) {
      if (bedrooms === "4+") {
        filter.bedrooms = { $gte: 4 };
      } else {
        filter.bedrooms = Number(bedrooms);
      }
    }

    // Bathrooms filter with 4+ support
    const bathrooms = searchParams.get("bathrooms");
    if (bathrooms) {
      if (bathrooms === "4+") {
        filter.bathrooms = { $gte: 4 };
      } else {
        filter.bathrooms = Number(bathrooms);
      }
    }

    // Parking filter
    const parking = searchParams.get("parking");
    if (parking) {
      if (parking === "3") {
        filter.parking = { $gte: 3 };
      } else {
        filter.parking = Number(parking);
      }
    }

    // Amenities filter
    const amenities = searchParams.get("amenities");
    if (amenities) {
      const amenitiesArray = amenities.split(",").filter((a) => a.trim());
      if (amenitiesArray.length > 0) {
        filter.amenities = { $in: amenitiesArray };
      }
    }

    // Enhanced search - now includes address and city
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { locality: new RegExp(search, "i") },
        { address: new RegExp(search, "i") },
        { city: new RegExp(search, "i") },
      ];
    }

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Enhanced sorting options
    const sort = searchParams.get("sort") || "newest";
    let sortObj = {};

    switch (sort) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "price-low":
        sortObj = { price: 1 };
        break;
      case "price-high":
        sortObj = { price: -1 };
        break;
      case "area-low":
        sortObj = { area: 1 };
        break;
      case "area-high":
        sortObj = { area: -1 };
        break;
      case "popular":
        sortObj = { views: -1, inquiries: -1 };
        break;
      default:
        // Fallback to legacy sorting for backward compatibility
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
        sortObj = { [sortBy]: sortOrder };
    }

    // Execute query with enhanced population
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("userId", "name avatar role")
        .sort(sortObj)
        .select("-email -phoneNumber")
        .skip(skip)
        .limit(limit)
        .lean(),
      Listing.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Enhanced response with additional metadata
    return successResponse(
      {
        listings,
        pagination: {
          currentPage: page,
          totalPages,
          total: total,
          totalListings: total, // Keep for backward compatibility
          hasMore: page < totalPages,
          limit,
          skip,
        },
        filters: {
          applied: Object.keys(filter).length - 1, // -1 for isActive filter
          total: total,
        },
      },
      "Listings retrieved successfully"
    );
  } catch (error) {
    console.error("Get listings error:", error);
    return errorResponse("Failed to retrieve listings", 500);
  }
}

// POST /api/listings - Create new listing
export async function POST(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "propertyType",
      "listingType",
      "address",
      "city",
      "state",
      "pincode",
      "area",
      "price",
      "contactPerson",
      "phoneNumber",
      "email",
      "userType",
    ];

    const missingFields = validateRequired(requiredFields, body);
    if (missingFields.length > 0) {
      return errorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // Validate email and phone
    if (!validateEmail(body.email)) {
      return errorResponse("Invalid email format", 400);
    }

    if (!validatePhone(body.phoneNumber)) {
      return errorResponse("Invalid phone number format", 400);
    }

    if (!validatePincode(body.pincode)) {
      return errorResponse("Invalid pincode format", 400);
    }

    // Create listing
    const listingData = {
      ...body,
      userId: authResult.user._id,
      amenities: body.amenities || [],
      nearbyPlaces: body.nearbyPlaces || [],
      images: body.images || [],
    };

    const listing = new Listing(listingData);
    await listing.save();

    // Populate user data
    await listing.populate("userId", "name email phone avatar");

    return successResponse(listing, "Listing created successfully", 201);
  } catch (error) {
    console.error("Create listing error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse("Validation failed", 400, errors);
    }
    return errorResponse("Failed to create listing", 500);
  }
}
