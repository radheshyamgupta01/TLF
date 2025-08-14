"use client";
import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { Home, DollarSign, TrendingUp, Building } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axiosInstance from "@/lib/axios";

const DashboardContent = ({ activeTab }) => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [activeTab === "dashboard"]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/dashboard`);

      if (response.data.success) {
        // console.log(response.data);
        setDashboardData(response.data.data);
        // setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(dashboardData?.length);

  return loading && dashboardData.listings ? (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-gray-500">Loading users...</p>
    </div>
  ) : (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={dashboardData?.listings?.total || 0}
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Active Listings"
          value={dashboardData?.listings?.active || 0}
          icon={Home}
          color="green"
        />
        <StatCard
          title="Growth This Month"
          value={dashboardData?.listings?.growth || 0}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Featured Listings"
          value={dashboardData?.listings?.featured || 0}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Charts */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData?.activity?.recentListings || 0}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Property Types
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData?.activity?.recentUsers || 0}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {dashboardData?.activity?.recentUsers?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardContent;
