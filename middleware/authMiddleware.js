import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

// Regular auth middleware for comparison
export async function authMiddleware(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: "Access token required",
        status: 401,
      };
    }

    const token = authHeader.substring(7);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return {
        error: "Invalid or expired token",
        status: 401,
      };
    }

    const user = await User.findById(decoded.userId).select("+role +isActive");

    if (!user) {
      return {
        error: "User not found",
        status: 401,
      };
    }

    if (!user.isActive) {
      return {
        error: "Account is deactivated",
        status: 403,
      };
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    console.error("Auth middleware error:", error);
    return {
      error: "Authentication failed",
      status: 500,
    };
  }
}
