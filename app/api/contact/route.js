// app/api/contact/route.js
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Contact from "@/models/Contact";
import { successResponse, errorResponse } from "@/lib/response";

// Validation function
function validateContactData(data) {
  const { name, email, subject, message } = data;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  if (name && name.trim().length > 100) {
    errors.push("Name cannot exceed 100 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Please provide a valid email address");
  }

  if (!subject || subject.trim().length < 3) {
    errors.push("Subject must be at least 3 characters long");
  }
  if (subject && subject.trim().length > 200) {
    errors.push("Subject cannot exceed 200 characters");
  }

  if (!message || message.trim().length < 10) {
    errors.push("Message must be at least 10 characters long");
  }
  if (message && message.trim().length > 2000) {
    errors.push("Message cannot exceed 2000 characters");
  }

  return errors;
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, subject, message } = body;
    console.log("i m in contact page ",body)

    // Validate input data
    const validationErrors = validateContactData(body);
    if (validationErrors.length > 0) {
      return errorResponse("Validation failed", 400, validationErrors);
    }

    // Create contact document
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: "unread",
      ipAddress:
        request.headers.get("x-forwarded-for") || request.ip || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    };

    // Save to database
    const contact = new Contact(contactData);
    const savedContact = await contact.save();


    return successResponse(
      {
        id: savedContact._id,
        message: "Contact message sent successfully",
      },
      "Thank you for contacting us! We'll get back to you soon."
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return errorResponse("Validation failed", 400, validationErrors);
    }

    return errorResponse("Internal server error. Please try again later.", 500);
  }
}
