"use client";
import React from "react";
import { CheckCircle, Home, Plus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ThankYouPage = () => {
  const router = useRouter();
  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your property has been successfully submitted. We will review it and
          get back to you soon.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          {/* Post Another Property */}
          <Link
            href="/post-property"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5" />
            Post Another Property
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Go to Dashboard */}
          <button
            onClick={() => handleNavigate("/agents-dashboard")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="/contact-us"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
