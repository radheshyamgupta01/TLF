const SavedSearchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    searchCriteria: {
      city: String,
      state: String,
      propertyType: String,
      listingType: String,
      minPrice: Number,
      maxPrice: Number,
      minArea: Number,
      maxArea: Number,
      bedrooms: Number,
      furnishing: String,
      amenities: [String],
    },
    alertEnabled: {
      type: Boolean,
      default: true,
    },
    lastAlertSent: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SavedSearch =
  mongoose.models.SavedSearch ||
  mongoose.model("SavedSearch", SavedSearchSchema);
