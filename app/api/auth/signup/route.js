import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { successResponse, errorResponse } from "@/lib/response";
import { validateEmail, validateRequired } from "@/lib/validations";
import connectDB from "@/lib/mongoose";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "password", "role"];
    const missingFields = validateRequired(requiredFields, body);

    if (missingFields.length > 0) {
      return errorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const { name, email, password, role, phone } = body;

    // Validate email format
    if (!validateEmail(email)) {
      return errorResponse("Invalid email format", 400);
    }

    // Validate role
    const validRoles = ["buyer", "seller", "broker", "developer"];
    if (!validRoles.includes(role)) {
      return errorResponse("Invalid role", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("User already exists with this email", 409);
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role,
      phone: phone || "",
    });

    await user.save();

    // Generate JWT token
    const token = signToken({ userId: user._id });

    return successResponse(
      {
        user: user.toJSON(),
        token,
      },
      "User created successfully",
      201
    );
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse("Failed to create user", 500);
  }
}
