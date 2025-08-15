"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, Shield, ListOrdered, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { Navigation } from "@/components/Content/Admin/Navigations";
import DashboardContent from "@/components/Admin/DashboardContent";
import PropertiesContent from "@/components/Content/Admin/PropertiesContent";
import UsersManagement from "@/components/Content/Admin/UsersManagement";
import axiosInstance from "@/lib/axios";
import LeadsManagement from "@/components/Content/Admin/LeadsManagement";
import MainLoader from "@/components/Loaders/MainLoader";

const RealEstateDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const { user, isLoading, error } = useSelector((state) => state.auth);

  // Admin access check
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role !== "admin") {
        setAccessDenied(true);
      } else {
        setAccessDenied(false);
        const getProperties = async () => {
          if (!user) return;

          try {
            setLoading(true);
            const res = await axiosInstance.get("/admin/listings");
            // console.log(res?.data?.data);
            setProperties(res?.data?.data?.listings);
          } catch (error) {
            console.error("Failed to fetch properties:", error);
            setProperties([]);
          } finally {
            setLoading(false);
          }
        };

        getProperties();
      }
    }
  }, [activeTab === "properties"]);

  // If not admin, show access denied
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-serif">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <Shield size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin dashboard. This area
            is restricted to administrators only.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <MainLoader />;
  }

  // API Functions with admin role verification
  const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (response.status === 403) {
      setAccessDenied(true);
      throw new Error("Access denied");
    }

    return response;
  };

  const addProperty = async (propertyData) => {
    try {
      const response = await apiCall("/api/admin/listings", {
        method: "POST",
        body: JSON.stringify(propertyData),
      });
      const newProperty = await response.json();
      setProperties([...properties, newProperty]);
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      await apiCall(`/api/admin/listings/${id}`, {
        method: "PUT",
        body: JSON.stringify(propertyData),
      });
      setProperties(
        properties.map((p) => (p.id === id ? { ...p, ...propertyData } : p))
      );
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const deleteProperty = async (id) => {
    try {
      await apiCall(`/api/admin/listings/${id}`, { method: "DELETE" });
      setProperties(properties.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-700">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-xl font-bold text-gray-900">CP Market</h1>
            <span className="text-xs text-blue-600 font-medium">
              Admin Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6">
          {Navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-700"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-blue-50 rounded-lg p-3">
          <div className="flex items-center">
            <Shield size={16} className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">{user?.name}</p>
              <p className="text-xs text-blue-600">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <DashboardContent activeTab={activeTab} />
          )}
          {activeTab === "properties" && (
            <PropertiesContent
              properties={properties}
              loading={loading}
              onAdd={addProperty}
              onUpdate={updateProperty}
              onDelete={deleteProperty}
            />
          )}
          {activeTab === "users" && <UsersManagement activeTab={activeTab} />}
          {activeTab === "leads" && <LeadsManagement activeTab={activeTab} />}
          {/*  {activeTab === "analytics" && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Detailed analytics dashboard coming soon...
              </p>
            </div>
          )}
          {activeTab === "calendar" && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Calendar & Appointments
              </h3>
              <p className="text-gray-600">
                Calendar management features coming soon...
              </p>
            </div>
          )} */}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default RealEstateDashboard;
