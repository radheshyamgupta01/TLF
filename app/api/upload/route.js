import formidable from "formidable";

import { NextResponse } from "next/server";
import fs from "fs";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export const maxDuration = 60;

export const sizeLimit = "10mb";

export async function POST(request) {
  try {
    console.log("🚀 === STARTING UPLOAD API ===");

    const formData = await request.formData();
    console.log("📦 Raw FormData:", formData);

    // Debug: Log all form data entries
    console.log("🔍 === DEBUGGING FORM DATA ENTRIES ===");
    for (const [key, value] of formData.entries()) {
      console.log(`Key: "${key}", Value type: ${typeof value}, Value:`, value);
      if (value instanceof File) {
        console.log(
          `  📁 File details - Name: ${value.name}, Size: ${value.size}, Type: ${value.type}`
        );
      }
    }

    // Debug: Check all possible key variations
    console.log("🔍 === CHECKING DIFFERENT KEY VARIATIONS ===");
    const imagesPlural = formData.getAll("images");
    const imageSingular = formData.getAll("image");
    const imageFiles = formData.getAll("imageFiles");
    const files = formData.getAll("files");

    console.log("formData.getAll('images'):", imagesPlural);
    console.log("formData.getAll('image'):", imageSingular);
    console.log("formData.getAll('imageFiles'):", imageFiles);
    console.log("formData.getAll('files'):", files);

    // Try to get files from any of these keys
    let allFiles = [];
    if (imagesPlural.length > 0) {
      console.log("✅ Found files with key 'images'");
      allFiles = imagesPlural;
    } else if (imageSingular.length > 0) {
      console.log("✅ Found files with key 'image'");
      allFiles = imageSingular;
    } else if (imageFiles.length > 0) {
      console.log("✅ Found files with key 'imageFiles'");
      allFiles = imageFiles;
    } else if (files.length > 0) {
      console.log("✅ Found files with key 'files'");
      allFiles = files;
    } else {
      console.log("❌ No files found with any key variation");
    }

    console.log("📋 Final files array:", allFiles);
    console.log("📊 Files count:", allFiles.length);

    // Check if files exist
    if (!allFiles || allFiles.length === 0) {
      console.log("❌ No files found in form data");
      return NextResponse.json(
        {
          error: "No files uploaded",
          debug: {
            formDataKeys: Array.from(formData.keys()),
            checkedKeys: ["images", "image", "imageFiles", "files"],
          },
        },
        { status: 400 }
      );
    }

    // Filter out any non-file entries
    console.log("🔍 === VALIDATING FILES ===");
    const validFiles = allFiles.filter((file, index) => {
      console.log(`Checking file ${index}:`, file);
      console.log(`  - Is File instance: ${file instanceof File}`);
      console.log(`  - Size: ${file.size}`);
      console.log(`  - Size > 0: ${file.size > 0}`);

      const isValid = file instanceof File && file.size > 0;
      console.log(`  - Is valid: ${isValid}`);
      return isValid;
    });

    console.log("✅ Valid files:", validFiles);
    console.log("📊 Valid files count:", validFiles.length);

    if (validFiles.length === 0) {
      console.log("❌ No valid files found");
      return NextResponse.json(
        {
          error: "No valid files uploaded",
          debug: {
            totalFiles: allFiles.length,
            validFiles: validFiles.length,
            fileDetails: allFiles.map((f) => ({
              name: f.name || "unnamed",
              size: f.size || 0,
              type: f.type || "unknown",
              isFile: f instanceof File,
            })),
          },
        },
        { status: 400 }
      );
    }

    console.log(`🎯 Processing ${validFiles.length} files`);

    const uploadedFiles = [];
    const failedFiles = [];

    // Process uploads in parallel for better performance
    const uploadPromises = validFiles.map(async (file, index) => {
      console.log(
        `🔄 Processing file ${index + 1}/${validFiles.length}: ${
          file.name
        }, size: ${file.size}`
      );

      try {
        // Convert file to buffer
        console.log(`📥 Converting file ${file.name} to buffer...`);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log(`✅ Buffer created, size: ${buffer.length} bytes`);

        // Upload to Cloudinary
        console.log(`☁️ Uploading ${file.name} to Cloudinary...`);
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "real-estate",
                public_id: `${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                transformation: [
                  { width: 1000, height: 750, crop: "limit" },
                  { quality: "auto" },
                  { fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) {
                  console.error(
                    `❌ Cloudinary upload error for ${file.name}:`,
                    error
                  );
                  reject(error);
                } else {
                  console.log(
                    `✅ Cloudinary upload success for ${file.name}:`,
                    result.secure_url
                  );
                  resolve(result);
                }
              }
            )
            .end(buffer);
        });

        console.log(
          `🎉 File uploaded to Cloudinary: ${uploadResult.secure_url}`
        );

        return {
          success: true,
          data: {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
            original_filename: file.name,
          },
        };
      } catch (uploadError) {
        console.error(`❌ Error uploading file ${file.name}:`, uploadError);
        return {
          success: false,
          filename: file.name,
          error: uploadError.message,
        };
      }
    });

    // Wait for all uploads to complete
    console.log("⏳ Waiting for all uploads to complete...");
    const results = await Promise.all(uploadPromises);
    console.log("✅ All upload promises resolved");

    // Separate successful and failed uploads
    results.forEach((result, index) => {
      console.log(`📊 Result ${index + 1}:`, result);
      if (result.success) {
        uploadedFiles.push(result.data);
      } else {
        failedFiles.push(result);
      }
    });

    console.log(
      `📈 Upload Summary - Success: ${uploadedFiles.length}, Failed: ${failedFiles.length}`
    );

    // Handle response based on results
    if (uploadedFiles.length === 0) {
      console.log("❌ No files uploaded successfully");
      return NextResponse.json(
        {
          error: "Failed to upload any files to Cloudinary",
          attempted: validFiles.length,
          failures: failedFiles,
        },
        { status: 500 }
      );
    }

    // Partial or complete success
    const response = {
      message:
        uploadedFiles.length === validFiles.length
          ? "All files uploaded successfully to Cloudinary"
          : "Some files uploaded successfully",
      files: uploadedFiles,
      count: uploadedFiles.length,
      attempted: validFiles.length,
    };

    if (failedFiles.length > 0) {
      response.failures = failedFiles;
      response.warning = `${failedFiles.length} files failed to upload`;
    }

    console.log("🎉 === UPLOAD COMPLETE ===");
    console.log("📤 Response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
