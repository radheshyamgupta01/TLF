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
    const requiredFields = ["email", "password"];
    const missingFields = validateRequired(requiredFields, body);

    if (missingFields.length > 0) {
      return errorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const { email, password } = body;

    // Validate email format
    if (!validateEmail(email)) {
      return errorResponse("Invalid email format", 400);
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse("Account is deactivated", 401);
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = signToken({ userId: user._id });

    return successResponse(
      {
        user: user.toJSON(),
        token,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Login failed", 500);
  }
}
