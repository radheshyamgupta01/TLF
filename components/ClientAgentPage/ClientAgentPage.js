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

function ClientAgentPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading, error } = useSelector((state) => state.auth);
    const [viewModal, setViewModal] = useState({ open: false, property: null });
    const [editModal, setEditModal] = useState({ open: false, property: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, property: null });
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

        const res = await axiosInstance.get("/inquiries/my-inquiries");

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
      if (user.role === "admin" || user.role === "buyer") {
        setAccessDenied(true);
      } else {
        setAccessDenied(false);
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
            You don't have permission to access the agent dashboard. This area
            is restricted to agents only.
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
      {/* Header */}
      {/* <header className="bg-gray-100 shadow-sm border-b">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />

                <span className="text-xs lg:text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header> */}

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
                  Leads ({filteredLeads.length})
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
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Contact
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(lead._id, "contacted")
                        }
                        disabled={
                          updatingStatus === lead._id ||
                          lead.status === "contacted"
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {updatingStatus === lead._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : lead.status === "contacted" ? (
                          "Already Contacted"
                        ) : (
                          "Mark as Contacted"
                        )}
                      </button>

                      {/* Additional status buttons */}
                      {lead.status === "contacted" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(lead._id, "interested")
                            }
                            disabled={updatingStatus === lead._id}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                          >
                            Mark Interested
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(lead._id, "not-interested")
                            }
                            disabled={updatingStatus === lead._id}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                          >
                            Not Interested
                          </button>
                        </>
                      )}

                      {lead.status === "interested" && (
                        <button
                          onClick={() => handleStatusUpdate(lead._id, "closed")}
                          disabled={updatingStatus === lead._id}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
                        >
                          Mark as Closed
                        </button>
                      )}
                      <Link
                        href={`/properties/${lead.listingId?._id}`}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
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

           {viewModal.open && (
                        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
                                {/* Header - Fixed */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 shrink-0">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-white">Property Details</h2>
                                            <p className="text-indigo-100 text-sm mt-1">Complete property information</p>
                                        </div>
                                        <button
                                            onClick={() => setViewModal({ open: false, property: null })}
                                            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                                            aria-label="Close modal"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content - Scrollable */}
                                <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-gray-50">
                                    {viewModal.property && (
                                        <div className="space-y-6">
                                            {/* Title and Description Card */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <div className="flex items-start">
                                                    <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4 shrink-0"></div>
                                                    <div className="flex-1">
                                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                                            {viewModal.property.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                                            {viewModal.property.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property Type and Listing Type */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-200">
                                                    <div className="flex items-center mb-2">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                                        <h4 className="font-semibold text-blue-900 text-sm sm:text-base">Property Type</h4>
                                                    </div>
                                                    <p className="text-blue-700 text-sm sm:text-base font-medium">{viewModal.property.propertyType}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5 rounded-xl border border-purple-200">
                                                    <div className="flex items-center mb-2">
                                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                                        <h4 className="font-semibold text-purple-900 text-sm sm:text-base">Listing Type</h4>
                                                    </div>
                                                    <p className="text-purple-700 text-sm sm:text-base font-medium capitalize">{viewModal.property.type}</p>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 sm:p-5 rounded-xl border border-emerald-200">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                                                    <h4 className="font-semibold text-emerald-900 text-sm sm:text-base">Location</h4>
                                                </div>
                                                <p className="text-emerald-700 text-sm sm:text-base font-medium">{viewModal.property.location}</p>
                                            </div>

                                            {/* Price - Featured */}
                                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-5 sm:p-6 rounded-xl border-2 border-green-300 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="flex items-center mb-2">
                                                            <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                                                            <h4 className="font-bold text-green-900 text-base sm:text-lg">Property Price</h4>
                                                        </div>
                                                        <p className="text-green-800 font-bold text-xl sm:text-3xl">
                                                            {formatPrice(viewModal.property.price, viewModal.property.priceType)}
                                                        </p>
                                                    </div>
                                                    <div className="text-green-600 opacity-20">
                                                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property Details Grid */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mr-3"></div>
                                                    Property Features
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center border border-blue-200">
                                                        <div className="text-blue-600 mb-2">
                                                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <h5 className="font-semibold text-blue-900 text-xs sm:text-sm mb-1">Bedrooms</h5>
                                                        <p className="text-blue-700 text-sm sm:text-base font-bold">{viewModal.property.bedrooms}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center border border-purple-200">
                                                        <div className="text-purple-600 mb-2">
                                                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <h5 className="font-semibold text-purple-900 text-xs sm:text-sm mb-1">Bathrooms</h5>
                                                        <p className="text-purple-700 text-sm sm:text-base font-bold">{viewModal.property.bathrooms}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center border border-green-200">
                                                        <div className="text-green-600 mb-2">
                                                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <h5 className="font-semibold text-green-900 text-xs sm:text-sm mb-1">Area</h5>
                                                        <p className="text-green-700 text-sm sm:text-base font-bold">
                                                            {viewModal.property.area} {viewModal.property.areaUnit}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center border border-orange-200">
                                                        <div className="text-orange-600 mb-2">
                                                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                                                            </svg>
                                                        </div>
                                                        <h5 className="font-semibold text-orange-900 text-xs sm:text-sm mb-1">Parking</h5>
                                                        <p className="text-orange-700 text-sm sm:text-base font-bold">{viewModal.property.parking} spaces</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Furnishing */}
                                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 sm:p-5 rounded-xl border border-pink-200">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                                                    <h4 className="font-semibold text-pink-900 text-sm sm:text-base">Furnishing Status</h4>
                                                </div>
                                                <p className="text-pink-700 text-sm sm:text-base font-medium">{viewModal.property.furnishing}</p>
                                            </div>

                                            {/* Amenities */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full mr-3"></div>
                                                    Amenities & Features
                                                </h4>
                                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                                    {viewModal.property.amenities.map((amenity, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 rounded-full text-xs sm:text-sm font-semibold border border-cyan-200 hover:from-cyan-200 hover:to-blue-200 transition-all duration-200"
                                                        >
                                                            {amenity}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Contact Information */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                                                    Contact Information
                                                </h4>
                                                <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                                                    <div className="space-y-4">
                                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                                            <div className="flex items-center sm:min-w-[140px] mb-1 sm:mb-0">
                                                                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">Contact Person:</span>
                                                            </div>
                                                            <span className="text-gray-700 text-sm sm:text-base sm:ml-2 font-medium">{viewModal.property.contact.contactPerson}</span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                                            <div className="flex items-center sm:min-w-[140px] mb-1 sm:mb-0">
                                                                <Phone className="h-4 w-4 text-green-600 mr-2" />
                                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">Phone:</span>
                                                            </div>
                                                            <a
                                                                href={`tel:${viewModal.property.contact.phoneNumber}`}
                                                                className="text-green-600 hover:text-green-700 text-sm sm:text-base sm:ml-2 transition-colors font-medium hover:underline"
                                                            >
                                                                {viewModal.property.contact.phoneNumber}
                                                            </a>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                                            <div className="flex items-center sm:min-w-[140px] mb-1 sm:mb-0">
                                                                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">Email:</span>
                                                            </div>
                                                            <a
                                                                href={`mailto:${viewModal.property.contact.email}`}
                                                                className="text-blue-600 hover:text-blue-700 text-sm sm:text-base sm:ml-2 transition-colors font-medium break-all hover:underline"
                                                            >
                                                                {viewModal.property.contact.email}
                                                            </a>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                                            <div className="flex items-center sm:min-w-[140px] mb-1 sm:mb-0">
                                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                                                <span className="font-semibold text-gray-800 text-sm sm:text-base">User Type:</span>
                                                            </div>
                                                            <span className="text-gray-700 text-sm sm:text-base sm:ml-2 capitalize font-medium">{viewModal.property.contact.userType}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer with Action Buttons */}
                                <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 shrink-0">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <a
                                            href={`tel:${viewModal.property?.contact.phoneNumber}`}
                                            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call Now
                                        </a>
                                        <a
                                            href={`mailto:${viewModal.property?.contact.email}`}
                                            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            Send Email
                                        </a>
                                        <button
                                            onClick={() => setViewModal({ open: false, property: null })}
                                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}




                       {/* Edit Modal */}
                    {editModal.open && (
                        <div className="fixed font-serif  inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                                {/* Header - Fixed */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5 shrink-0">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Property</h2>
                                            <p className="text-blue-100 text-sm mt-1">Update your property information</p>
                                        </div>
                                        <button
                                            onClick={() => setEditModal({ open: false, property: null })}
                                            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                                            aria-label="Close modal"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content - Scrollable */}
                                <div className="overflow-y-auto flex-1 p-4 sm:p-6 bg-gray-50">
                                    {editModal.property && (
                                        <form className="space-y-6">
                                            {/* Basic Information Card */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                                                    Basic Information
                                                </h3>

                                                <div className="space-y-4">
                                                    {/* Title */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                                                        <input
                                                            type="text"
                                                            value={editModal.property.title}
                                                            onChange={(e) => updateEditForm('title', e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                            placeholder="Enter property title"
                                                        />
                                                    </div>

                                                    {/* Description */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                        <textarea
                                                            value={editModal.property.description}
                                                            onChange={(e) => updateEditForm('description', e.target.value)}
                                                            rows={4}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                                            placeholder="Describe your property in detail..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Property Details Card */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                                                    Property Details
                                                </h3>

                                                <div className="space-y-4">
                                                    {/* Price Section */}
                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                                                        <label className="block text-sm font-medium text-green-800 mb-2">Property Price</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 font-semibold">₹</span>
                                                            <input
                                                                type="number"
                                                                value={editModal.property.pricing?.price}
                                                                onChange={(e) => updateNestedEditForm('pricing', 'price', e.target.value)}
                                                                className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Room Details */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                                            <label className="block text-sm font-medium text-blue-800 mb-2">Bedrooms</label>
                                                            <input
                                                                type="number"
                                                                value={editModal.property.details?.bedrooms}
                                                                onChange={(e) => updateNestedEditForm('details', 'bedrooms', e.target.value)}
                                                                className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                placeholder="0"
                                                                min="0"
                                                            />
                                                        </div>

                                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                                            <label className="block text-sm font-medium text-purple-800 mb-2">Bathrooms</label>
                                                            <input
                                                                type="number"
                                                                value={editModal.property.details?.bathrooms}
                                                                onChange={(e) => updateNestedEditForm('details', 'bathrooms', e.target.value)}
                                                                className="w-full px-4 py-3 border border-purple-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                                                placeholder="0"
                                                                min="0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact Information Card */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
                                                    Contact Information
                                                </h3>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                                                        <label className="block text-sm font-medium text-orange-800 mb-2">Contact Person</label>
                                                        <input
                                                            type="text"
                                                            value={editModal.property.contact?.contactPerson}
                                                            onChange={(e) => updateNestedEditForm('contact', 'contactPerson', e.target.value)}
                                                            className="w-full px-4 py-3 border border-orange-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                                            placeholder="Enter contact person name"
                                                        />
                                                    </div>

                                                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200">
                                                        <label className="block text-sm font-medium text-teal-800 mb-2">Phone Number</label>
                                                        <input
                                                            type="text"
                                                            value={editModal.property.contact?.phoneNumber}
                                                            onChange={(e) => updateNestedEditForm('contact', 'phoneNumber', e.target.value)}
                                                            className="w-full px-4 py-3 border border-teal-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                                            placeholder="Enter phone number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Fields Card (Optional - you can add more fields here) */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <div className="w-2 h-6 bg-indigo-500 rounded-full mr-3"></div>
                                                    Additional Information
                                                </h3>

                                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                                                    <p className="text-indigo-800 text-sm">
                                                        You can add more fields here like area, amenities, location, etc.
                                                    </p>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {/* Footer - Fixed */}
                                <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 shrink-0">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setEditModal({ open: false, property: null })}
                                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={saveEdit}
                                            className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}





                    {/* Delete Modal */}
                    {deleteModal.open && (
                        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-auto transform transition-all duration-300 scale-100">
                                {/* Header with Gradient */}
                                <div className="bg-gradient-to-r from-red-500 to-pink-600 px-4 sm:px-6 py-4 sm:py-5">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="text-lg sm:text-xl font-bold text-white">Delete Property</h2>
                                                <p className="text-red-100 text-sm mt-1">Permanent removal confirmation</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setDeleteModal({ open: false, property: null })}
                                            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
                                            aria-label="Close modal"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-6 space-y-6">
                                    {/* Warning Message */}
                                    <div className="text-center">
                                        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4 border-4 border-red-200">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                            Are you sure you want to delete this property?
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            This action will permanently remove the property from your listings.
                                        </p>
                                    </div>

                                    {/* Property Information Card */}
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 sm:p-5">
                                        <div className="flex items-start">
                                            <div className="w-1 h-12 bg-gradient-to-b from-red-500 to-pink-500 rounded-full mr-3 shrink-0"></div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-red-800 mb-1">Property to be deleted:</h4>
                                                <p className="text-red-900 font-semibold text-base sm:text-lg break-words">
                                                    "{deleteModal.property?.title}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Warning Notice */}
                                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 sm:p-5">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-semibold text-amber-800 mb-1">Important Notice</h4>
                                                <p className="text-sm text-amber-700">
                                                    This action cannot be undone. All property data, images, and associated information will be permanently removed.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Consequences List */}
                                    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">What will be deleted:</h4>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                                                Property listing and description
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                                                Contact information and details
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                                                All associated data and history
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="bg-gray-50 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                        <button
                                            onClick={() => setDeleteModal({ open: false, property: null })}
                                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 order-2 sm:order-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 order-1 sm:order-2"
                                        >
                                            <span className="flex items-center justify-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1-1v3M4 7h16" />
                                                </svg>
                                                Delete Property
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}





      </div>
    </ProtectedRoute>
  );
}

export default ClientAgentPage;
