import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { authMiddleware } from "@/lib/authMiddleware";
import { successResponse, errorResponse } from "@/lib/response";
import { validateEmail, validatePhone } from "@/lib/validations";

export async function PATCH(request) {
  try {
    await connectDB();

    const authResult = await authMiddleware(request);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.status);
    }

    const body = await request.json();
    const {
      name,
      email,
      password,
      role,
      phone,
      company,
      profession,
      licenseno,
      experience,
      bio,
      specialties,
      address,
      avatar,
    } = body;

    const updateData = {};

    if (name) updateData.name = name.trim();
    if (phone) {
      if (!validatePhone(phone)) {
        return errorResponse("Invalid phone number format", 400);
      }
      updateData.phone = phone;
    }
    if (avatar) updateData.avatar = avatar;
    if (email) {
      if (!validateEmail(email))
        return errorResponse("Invalid email format", 400);
      updateData.email = email.toLowerCase();
    }

    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (role) updateData.role = role;
    if (company) updateData.company = company;
    if (profession) updateData.profession = profession;
    if (licenseno) updateData.licenseno = licenseno;
    if (experience) updateData.experience = experience;
    if (bio) updateData.bio = bio;
    if (Array.isArray(specialties)) updateData.specialties = specialties;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(authResult.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    return successResponse(user, "Profile updated successfully");
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse("Failed to update profile", 500);
  }
}
