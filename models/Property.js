import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    propertyType: {
      type: String,
      required: true,
    },
    listingType: {
      type: String,
      required: true,
    },

    // Location
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
    },

    // Property Details
    details: {
      bedrooms: {
        type: Number,
        required: true,
        min: 0,
      },
      bathrooms: {
        type: Number,
        required: true,
        min: 0,
      },
      area: {
        type: Number,
        required: true,
        min: 1,
      },
      areaUnit: {
        type: String,
        enum: ["sqft", "sqm", "acres"],
        default: "sqft",
      },
      furnishing: {
        type: String,
        enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      },
      parking: {
        type: Number,
        default: 0,
      },
      floor: {
        type: Number,
      },
      totalFloors: {
        type: Number,
      },
    },

    // Pricing
    pricing: {
      price: {
        type: String,
        required: true,
        min: 0,
      },
      priceType: {
        type: String,
      },
      maintenanceCharges: {
        type: String,
        default: 0,
      },
      securityDeposit: {
        type: String,
        default: 0,
      },
    },

    // Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "Property image",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    // ✅ Search terms for easier searching
    searchTerms: [String],

    // Contact Info
    contact: {
      contactPerson: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      userType: {
        type: String,
        enum: ["owner", "agent", "developer", "admin"],
        default: "agent",
        required: true,
      },
    },

    // Features
    amenities: [
      {
        type: String,
      },
    ],

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    nearbyPlaces: [
      {
        type: String,
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

    // Metadata
    views: {
      type: Number,
      default: 0,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
// Create compound indexes for better search performance
PropertySchema.index({
  "location.city": 1,
  propertyType: 1,
  listingType: 1,
  "pricing.price": 1,
});

PropertySchema.index({
  "location.pincode": 1,
  "details.bedrooms": 1,
  "pricing.price": 1,
});

PropertySchema.index({
  title: "text",
  description: "text",
  "location.address": "text",
  "location.locality": "text",
});

// Pre-save middleware to generate slug
PropertySchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now();
  }
  this.updatedAt = Date.now();
  next();
});

// Virtual for full address
PropertySchema.virtual("fullAddress").get(function () {
  return `${this.location.address}, ${this.location.locality}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Method to increment views
PropertySchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method for search
PropertySchema.statics.search = function (query) {
  const {
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    bedrooms,
    search,
    pincode,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = query;

  const filter = { isActive: true };

  if (city) filter["location.city"] = new RegExp(city, "i");
  if (propertyType) filter.propertyType = propertyType;
  if (listingType) filter.listingType = listingType;
  if (pincode) filter["location.pincode"] = pincode;
  if (bedrooms) filter["details.bedrooms"] = bedrooms;

  if (minPrice || maxPrice) {
    filter["pricing.price"] = {};
    if (minPrice) filter["pricing.price"].$gte = parseInt(minPrice);
    if (maxPrice) filter["pricing.price"].$lte = parseInt(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  return this.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate("contact", "contactPerson phoneNumber email userType");
};

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);
