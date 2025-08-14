import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: [
        "apartment",
        "house",
        "villa",
        "plot",
        "commercial",
        "office",
        "shop",
        "warehouse",
        "other",
      ],
    },
    listingType: {
      type: String,
      required: [true, "Listing type is required"],
      enum: ["sale", "rent", "lease"],
    },

    // Location
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
    },
    locality: {
      type: String,
      trim: true,
    },

    // Details
    bedrooms: {
      type: Number,
      min: [0, "Bedrooms cannot be negative"],
      max: [20, "Bedrooms cannot exceed 20"],
    },
    bathrooms: {
      type: Number,
      min: [0, "Bathrooms cannot be negative"],
      max: [20, "Bathrooms cannot exceed 20"],
    },
    area: {
      type: Number,
      required: [true, "Area is required"],
      min: [1, "Area must be at least 1"],
    },
    areaUnit: {
      type: String,
      enum: ["sqft", "sqmt", "acre", "bigha"],
      default: "sqft",
    },
    furnishing: {
      type: String,
      enum: ["fully-furnished", "semi-furnished", "unfurnished"],
      default: "unfurnished",
    },
    parking: {
      type: Number,
      min: [0, "Parking cannot be negative"],
      default: 0,
    },
    floor: {
      type: Number,
      min: [0, "Floor cannot be negative"],
    },
    totalFloors: {
      type: Number,
      min: [1, "Total floors must be at least 1"],
    },

    // Pricing
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    priceType: {
      type: String,
      enum: ["fixed", "negotiable"],
      default: "negotiable",
    },
    maintenanceCharges: {
      type: Number,
      min: [0, "Maintenance charges cannot be negative"],
      default: 0,
    },
    securityDeposit: {
      type: Number,
      min: [0, "Security deposit cannot be negative"],
      default: 0,
    },

    // Images
    images: [
      {
        url: String,
        publicId: String,
        alt: String,
      },
    ],

    // Contact Info
    contactPerson: {
      type: String,
      required: [true, "Contact person is required"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    // Ownership
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userType: {
      type: String,
      enum: ["seller", "broker", "developer", "admin"],
      required: [true, "User type is required"],
    },

    // Features
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    nearbyPlaces: [
      {
        name: String,
        distance: String,
        type: {
          type: String,
          enum: [
            "school",
            "hospital",
            "mall",
            "metro",
            "bus-stop",
            "park",
            "restaurant",
            "other",
          ],
        },
      },
    ],

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "pending",
    },
    inquiries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
ListingSchema.index({ city: 1, propertyType: 1, listingType: 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ userId: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ isActive: 1, isVerified: 1 });

export default mongoose.models.Listing ||
  mongoose.model("Listing", ListingSchema);
