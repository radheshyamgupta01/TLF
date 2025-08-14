import axiosInstance from "@/lib/axios";
import { FormatPrice } from "@/utils/formatPrice";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const LeftSidebar = ({
  activeTab,
  sidebarOpen,
  searchTerm,
  setActiveTab,
  user,
}) => {
  return (
    <div
      className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-80 lg:w-1/3 xl:w-1/4 2xl:w-1/3
          bg-white border-r border-gray-200 overflow-y-auto
          transform transition-transform duration-200 ease-in-out lg:transform-none
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
    >
      <div className="p-4 lg:p-6">
        {/* Property Management Tabs */}
        <div className="flex space-x-1 mb-4 lg:mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("properties")}
            className={`flex-1 py-2 px-2 lg:px-3 rounded-md text-xs lg:text-sm font-medium transition-colors ${
              activeTab === "properties"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 px-2 lg:px-3 rounded-md text-xs lg:text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Profile
          </button>
        </div>

        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="space-y-4 lg:space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                {user?.avatar ? (
                  <Image
                    width={500}
                    height={500}
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover ring-white shadow-lg group-hover/card:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <User className="w-10 h-10 lg:w-12 lg:h-12 text-blue-600" />
                )}
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                {user?.name}
              </h3>
              <p className="text-sm lg:text-base text-gray-600">
                {user?.profession || "Not Provided"}
              </p>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-3 text-gray-600 text-sm lg:text-base">
                <Mail className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 text-sm lg:text-base">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span>{user?.phone || "+91 XXXX XXXXXX"}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 text-sm lg:text-base">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="truncate">
                  {user?.address || "Not Provided"}
                </span>
              </div>
            </div>

            {/* <div className="grid grid-cols-2 gap-3 lg:gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-blue-600">
                  {properties?.length || 0}
                </div>
                <div className="text-xs lg:text-sm text-gray-600">
                  Properties
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-green-600">
                  {user?.sales || 0}
                </div>
                <div className="text-xs lg:text-sm text-gray-600">Sales</div>
              </div>
            </div> */}

            <Link href="/edit-profile" className="block w-full">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base">
                Edit Profile
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
