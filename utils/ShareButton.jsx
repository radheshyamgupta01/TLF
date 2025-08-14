"use client";
import React from "react";
import { Share2 } from "lucide-react";

const ShareButton = ({
  title = document.title,
  text = "Check this out!",
  url = window.location.href,
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        // console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      // fallback if Web Share API is not supported
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } catch (error) {
        alert("Failed to copy link. Please copy manually.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
};

export default ShareButton;
