"use client";
import {
  Building2,
  Users,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Filter,
  Search,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import LeftSidebar from "./LeftSidebar";
import axiosInstance from "@/lib/axios";
import { FormatPrice } from "@/utils/formatPrice";
import ProtectedRoute from "../auth/ProtectedRoute";

function UserDashPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [propLeads, setPropLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const getPropertyLeads = async () => {
      try {
        setLeadsLoading(true);
        setLeadsError(null);

        const res = await axiosInstance.get("/users/inquiries");

        // console.log(res.data);
        // axiosInstance returns response.data directly, not a Response object
        if (res.data && res.data.success) {
          setPropLeads(res.data.data.inquiries || []);
        } else {
          throw new Error(res.data?.message || "Failed to fetch inquiries");
        }
      } catch (error) {
        console.error("Failed to fetch inquiries:", error);
        setLeadsError(error.response?.data?.message || error.message);
        setPropLeads([]);
      } finally {
        setLeadsLoading(false);
      }
    };

    // Only fetch if user is available (logged in)
    if (user && user._id) {
      if (user.role !== "buyer") {
        setAccessDenied(true);
      } else {
        getPropertyLeads();
      }
    } else if (!isLoading) {
      // If not loading auth state and no user, set empty leads
      setPropLeads([]);
      setLeadsLoading(false);
    }
  }, [user, isLoading]);

  // console.log("user", user);

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      setUpdatingStatus(leadId);

      const res = await axiosInstance.patch(`/inquiries/${leadId}`, {
        status: newStatus,
      });

      if (res.data && res.data.success) {
        // Update the local state
        // console.log(res.data);
        setPropLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === leadId
              ? { ...lead, status: newStatus, respondedAt: new Date() }
              : lead
          )
        );

        // Show success message (you can replace with a toast notification)
        alert(`Lead status updated to ${newStatus}`);
      } else {
        throw new Error(res.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "interested":
        return "bg-green-100 text-green-800 border-green-200";
      case "not-interested":
        return "bg-red-100 text-red-800 border-red-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Update the filteredLeads memoization to handle loading state
  const filteredLeads = useMemo(() => {
    if (!propLeads || propLeads.length === 0) return [];

    return propLeads.filter((lead) => {
      // Map inquiry data to lead format for compatibility
      const leadData = {
        name: lead.inquirerName,
        email: lead.inquirerEmail,
        phone: lead.inquirerPhone,
        status: lead.status,
        // Add other mappings as needed
      };

      const matchesSearch =
        leadData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leadData.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        leadData.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [propLeads, searchTerm, filterStatus]);

  // Handle sidebar close on mobile when clicking outside
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // If admin or buyer, show access denied
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <Shield size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the user dashboard. This area is
            restricted to users only.
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

  return (
    <ProtectedRoute className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleSidebarClose}
          />
        )}

        {/* Left Sidebar - Property Management */}
        <LeftSidebar
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          searchTerm={searchTerm}
          setActiveTab={setActiveTab}
          user={user}
        />

        {/* Right Side - Leads */}
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 mr-2" />
                <span className="hidden sm:inline">
                  Contacts ({filteredLeads.length})
                </span>
                <span className="sm:hidden">({filteredLeads.length})</span>
              </h2>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-4 lg:mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 lg:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 lg:w-5 lg:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-9 lg:pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm lg:text-base w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              </div>
            </div>

            {/* Leads List */}
            <div className="space-y-4">
              {leadsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading leads...</p>
                </div>
              ) : leadsError ? (
                <div className="text-center py-8 text-red-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-red-300" />
                  <p>Error loading leads</p>
                  <p className="text-sm mt-2">{leadsError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredLeads?.length > 0 ? (
                filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    className="bg-gray-50 p-4 lg:p-6 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg uppercase font-semibold text-gray-900 truncate">
                          {lead.inquirerName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {lead.listingId?.title || "Property Inquiry"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{lead.inquirerEmail}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{lead.inquirerPhone}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {lead.listingId?.propertyType || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">
                            {lead.listingId?.price
                              ? FormatPrice(lead.listingId.price, "fixed")
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="truncate ml-2">
                        Source: {lead.source || "Web"}
                      </span>
                    </div>

                    {lead.message && (
                      <div className="text-sm text-gray-700 bg-white p-3 rounded border mb-4">
                        <strong>Message:</strong> {lead.message}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/properties/${lead.listingId?._id}`}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                      >
                        View Property
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No leads found</p>
                  {(searchTerm || filterStatus !== "all") && (
                    <p className="text-sm mt-2">
                      Try adjusting your search or filter criteria
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default UserDashPage;
