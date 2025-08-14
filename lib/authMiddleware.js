import { verifyToken } from "./jwt";
import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "./mongoose";

export async function authMiddleware(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return { error: "No token provided", status: 401 };
    }

    const decoded = verifyToken(token);

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return { error: "Invalid token or user not found", status: 401 };
    }

    return { user };
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }
}
