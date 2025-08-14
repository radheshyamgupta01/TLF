// app/api/admin/contacts/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Contact from "@/models/Contact";
import { successResponse, errorResponse } from "@/lib/response";

// GET - Retrieve all contacts with pagination and filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isDeleted: false };

    // Status filter
    const status = searchParams.get("status");
    if (status && ["unread", "read", "replied", "archived"].includes(status)) {
      filter.status = status;
    }

    // Priority filter
    const priority = searchParams.get("priority");
    if (priority && ["low", "medium", "high"].includes(priority)) {
      filter.priority = priority;
    }

    // Date range filter
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Search in name, email, subject, or message
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { message: new RegExp(search, "i") },
      ];
    }

    // Sorting
    const sort = searchParams.get("sort") || "newest";
    let sortObj = {};

    switch (sort) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "priority":
        sortObj = { priority: -1, createdAt: -1 };
        break;
      case "status":
        sortObj = { status: 1, createdAt: -1 };
        break;
      case "name":
        sortObj = { name: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Execute query
    const [contacts, total, unreadCount] = await Promise.all([
      Contact.find(filter)
        .populate("assignedTo", "name email")
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter),
      Contact.getUnreadCount(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        contacts,
        pagination: {
          currentPage: page,
          totalPages,
          total,
          hasMore: page < totalPages,
          limit,
          skip,
        },
        stats: {
          unreadCount,
          totalContacts: total,
        },
      },
      "Contacts retrieved successfully"
    );
  } catch (error) {
    console.error("Get contacts error:", error);
    return errorResponse("Failed to retrieve contacts", 500);
  }
}

// PATCH - Update contact status or other fields
export async function PATCH(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { contactId, updates } = body;

    if (!contactId) {
      return errorResponse("Contact ID is required", 400);
    }

    // Validate updates
    const allowedUpdates = [
      "status",
      "priority",
      "assignedTo",
      "tags",
      "notes",
    ];
    const validUpdates = {};

    for (const key in updates) {
      if (allowedUpdates.includes(key)) {
        validUpdates[key] = updates[key];
      }
    }

    if (Object.keys(validUpdates).length === 0) {
      return errorResponse("No valid updates provided", 400);
    }

    // Update the contact
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { ...validUpdates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!contact) {
      return errorResponse("Contact not found", 404);
    }

    return successResponse({ contact }, "Contact updated successfully");
  } catch (error) {
    console.error("Update contact error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return errorResponse("Validation failed", 400, validationErrors);
    }

    return errorResponse("Failed to update contact", 500);
  }
}

// DELETE - Soft delete a contact
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("id");

    if (!contactId) {
      return errorResponse("Contact ID is required", 400);
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return errorResponse("Contact not found", 404);
    }

    await contact.softDelete();

    return successResponse(
      { message: "Contact deleted successfully" },
      "Contact has been moved to trash"
    );
  } catch (error) {
    console.error("Delete contact error:", error);
    return errorResponse("Failed to delete contact", 500);
  }
}
