// models/Contact.js
import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [3, "Subject must be at least 3 characters long"],
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    ipAddress: {
      type: String,
      default: "unknown",
    },
    userAgent: {
      type: String,
      default: "unknown",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ priority: 1 });
ContactSchema.index({ isDeleted: 1 });

// Text search index
ContactSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
});

// Virtual for display
ContactSchema.virtual("displayName").get(function () {
  return this.name || "Anonymous";
});

// Virtual for age (time since created)
ContactSchema.virtual("age").get(function () {
  return Date.now() - this.createdAt.getTime();
});

// Static method to get unread count
ContactSchema.statics.getUnreadCount = function () {
  return this.countDocuments({ status: "unread", isDeleted: false });
};

// Static method to get contacts by status
ContactSchema.statics.getByStatus = function (status, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("assignedTo", "name email");
};

// Instance method to mark as read
ContactSchema.methods.markAsRead = function () {
  this.status = "read";
  return this.save();
};

// Instance method to archive
ContactSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Instance method to soft delete
ContactSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
