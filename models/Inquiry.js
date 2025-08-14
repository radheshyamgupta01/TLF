import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: false,
      index: true,
      default: null,
    },
    inquirerName: {
      type: String,
      required: [true, "Inquirer name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    inquirerEmail: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      index: true,
    },
    inquirerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
      default: "",
    },
    inquirerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["new", "contacted", "interested", "not-interested", "closed"],
        message:
          "Status must be one of: new, contacted, interested, not-interested, closed",
      },
      default: "new",
      index: true,
    },
    listingOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
      default: null,
    },
    // Track if inquiry was responded to
    respondedAt: {
      type: Date,
    },
    // Store any response from the listing owner
    response: {
      type: String,
      trim: true,
      maxlength: [1000, "Response cannot exceed 1000 characters"],
    },
    // Priority level for follow-up
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    // Source of the inquiry (web, mobile app, etc.)
    source: {
      type: String,
      default: "web",
    },
    // Track follow-up attempts
    followUpCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Last follow-up date
    lastFollowUpAt: {
      type: Date,
    },
    // Additional metadata
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
    },
  },
  {
    timestamps: true,
    // Ensure virtuals are included in JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for better query performance
InquirySchema.index({ listingId: 1, createdAt: -1 });
InquirySchema.index({ listingOwnerId: 1, status: 1, createdAt: -1 });
InquirySchema.index({ inquirerEmail: 1, listingId: 1, createdAt: -1 });
InquirySchema.index({ status: 1, priority: 1, createdAt: -1 });

// Virtual for checking if inquiry is recent (within 24 hours)
InquirySchema.virtual("isRecent").get(function () {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt >= twentyFourHoursAgo;
});

// Virtual for time since inquiry
InquirySchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${Math.max(1, minutes)} minute${minutes > 1 ? "s" : ""} ago`;
  }
});

// Virtual for checking if needs follow-up
InquirySchema.virtual("needsFollowUp").get(function () {
  if (this.status === "closed" || this.status === "not-interested") {
    return false;
  }

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  return !this.respondedAt && this.createdAt <= threeDaysAgo;
});

// Method to mark as responded
InquirySchema.methods.markAsResponded = function (response) {
  this.respondedAt = new Date();
  this.response = response;
  this.status = "contacted";
  return this.save();
};

// Method to add follow-up
InquirySchema.methods.addFollowUp = function () {
  this.followUpCount += 1;
  this.lastFollowUpAt = new Date();
  return this.save();
};

// Method to check if can be followed up
InquirySchema.methods.canFollowUp = function () {
  const maxFollowUps = 3;
  const minHoursBetweenFollowUps = 24;

  if (this.followUpCount >= maxFollowUps) return false;
  if (this.status === "closed" || this.status === "not-interested")
    return false;

  if (this.lastFollowUpAt) {
    const hoursSinceLastFollowUp =
      (Date.now() - this.lastFollowUpAt) / (1000 * 60 * 60);
    return hoursSinceLastFollowUp >= minHoursBetweenFollowUps;
  }

  return true;
};

// Static method to find inquiries by listing
InquirySchema.statics.findByListing = function (listingId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    sortOrder = -1,
  } = options;
  const skip = (page - 1) * limit;

  const filter = {};

  // const filter = { listingId };
  // Handle null listingId for general inquiries
  if (listingId === null || listingId === "null") {
    filter.listingId = null;
  } else {
    filter.listingId = listingId;
  }
  if (status) filter.status = status;

  const sort = {};
  sort[sortBy] = sortOrder;

  return this.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("inquirerUserId", "name email")
    .populate("listingId", "title price");
};

// Static method to find recent inquiries for a user
InquirySchema.statics.findRecentByEmail = function (email, hours = 24) {
  const timeAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    inquirerEmail: email,
    createdAt: { $gte: timeAgo },
  });
};

// Static method to get inquiry statistics
InquirySchema.statics.getStats = async function (
  listingOwnerId,
  dateRange = 30,
  includeGeneral = false
) {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);

  const matchFilter = {
    createdAt: { $gte: startDate },
  };

  if (includeGeneral) {
    // Include both user's listings and general inquiries
    matchFilter.$or = [
      { listingOwnerId: new mongoose.Types.ObjectId(listingOwnerId) },
      { listingOwnerId: null },
    ];
  } else {
    // Only user's listing inquiries
    matchFilter.listingOwnerId = new mongoose.Types.ObjectId(listingOwnerId);
  }

  const stats = await this.aggregate([
    {
      $match: {
        listingOwnerId: new mongoose.Types.ObjectId(listingOwnerId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
        contacted: {
          $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
        },
        interested: {
          $sum: { $cond: [{ $eq: ["$status", "interested"] }, 1, 0] },
        },
        notInterested: {
          $sum: { $cond: [{ $eq: ["$status", "not-interested"] }, 1, 0] },
        },
        closed: { $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] } },
        averageResponseTime: {
          $avg: {
            $cond: [
              { $ne: ["$respondedAt", null] },
              { $subtract: ["$respondedAt", "$createdAt"] },
              null,
            ],
          },
        },
        generalInquiries: {
          $sum: { $cond: [{ $eq: ["$listingOwnerId", null] }, 1, 0] },
        },
        listingInquiries: {
          $sum: { $cond: [{ $ne: ["$listingOwnerId", null] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      new: 0,
      contacted: 0,
      interested: 0,
      notInterested: 0,
      closed: 0,
      averageResponseTime: null,
      generalInquiries: 0,
      listingInquiries: 0,
    }
  );
};

// Static method to find inquiries needing follow-up
InquirySchema.statics.findNeedingFollowUp = function (listingOwnerId) {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  return this.find({
    listingOwnerId,
    status: { $in: ["new", "contacted"] },
    createdAt: { $lte: threeDaysAgo },
    followUpCount: { $lt: 3 },
  }).populate("listingId", "title");
};

// Pre-save middleware to update respondedAt when status changes to contacted
InquirySchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "contacted" &&
    !this.respondedAt
  ) {
    this.respondedAt = new Date();
  }
  next();
});

// Pre-save middleware to validate phone number format
InquirySchema.pre("save", function (next) {
  if (this.isModified("inquirerPhone")) {
    // Remove any non-digit characters
    this.inquirerPhone = this.inquirerPhone.replace(/\D/g, "");
  }
  next();
});

// Post-save middleware for logging/notifications
InquirySchema.post("save", function (doc, next) {
  if (doc.isNew) {
    // Log new inquiry creation
    // console.log(`New inquiry created: ${doc._id} for listing ${doc.listingId}`);
    // Here you could trigger email notifications, webhooks, etc.
    // Example: sendNotificationToListingOwner(doc);
  }
  next();
});

const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);

export default Inquiry;
