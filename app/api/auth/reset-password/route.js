// app/api/auth/reset-password/route.js
import { NextResponse } from "next/server";
import User from "@/models/User";
import { successResponse, errorResponse } from "@/lib/response";
import connectDB from "@/lib/mongoose";

export async function POST(request) {
  try {
    await connectDB();
    const { token, password } = await request.json();

    // Validate required fields
    if (!token || !password) {
      return errorResponse("Token and password are required", 400);
    }

    // Validate password length
    if (password.length < 6) {
      return errorResponse("Password must be at least 6 characters", 400);
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Token not expired
    });

    if (!user) {
      return errorResponse("Invalid or expired reset token", 400);
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return successResponse({}, "Password reset successful");
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse("Failed to reset password", 500);
  }
}

// GET route to verify token validity
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return errorResponse("Token is required", 400);
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return errorResponse("Invalid or expired reset token", 400);
    }

    return successResponse({ valid: true }, "Token is valid");
  } catch (error) {
    console.error("Token verification error:", error);
    return errorResponse("Failed to verify token", 500);
  }
}
