"use client";
import {
  Building2,
  Users,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axios";
import { FormatPrice } from "@/utils/formatPrice";

const LeadsManagement = ({ activeTab }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [propLeads, setPropLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [counts, setCounts] = useState(null);
  const [stats, setStats] = useState(null);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [leadsError, setLeadsError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const getPropertyLeads = async (page = currentPage) => {
    try {
      setLeadsLoading(true);
      setLeadsError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus) params.append("status", filterStatus);
      if (filterType) params.append("type", filterType);
      if (filterPriority) params.append("priority", filterPriority);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      const res = await axiosInstance.get(
        `/admin/inquiries?${params.toString()}`
      );

      if (res.data && res.data.success) {
        setPropLeads(res.data.data.inquiries || []);
        setPagination(res.data.data.pagination || null);
        setCounts(res.data.data.counts || null);
        setStats(res.data.data.stats || null);
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

  useEffect(() => {
    if (user && user._id) {
      getPropertyLeads(1);
      setCurrentPage(1);
    } else if (!isLoading) {
      setPropLeads([]);
      setLeadsLoading(false);
    }
  }, [
    user,
    isLoading,
    searchTerm,
    filterStatus,
    filterType,
    filterPriority,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    limit,
  ]);

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      setUpdatingStatus(leadId);

      const res = await axiosInstance.patch(`/admin/inquiries/${leadId}`, {
        status: newStatus,
      });

      if (res.data && res.data.success) {
        setPropLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === leadId
              ? { ...lead, status: newStatus, respondedAt: new Date() }
              : lead
          )
        );
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getPropertyLeads(page);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterType("");
    setFilterPriority("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="mt-2 text-gray-600">
            Manage and track all property inquiries and leads
          </p>
        </div>
        <button
          onClick={() => getPropertyLeads(currentPage)}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total (30d)</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalRecent || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Mail className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.newRecent || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.respondedRecent || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  Avg Response
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.averageResponseTime
                    ? `${Math.round(
                        stats.averageResponseTime / (1000 * 60 * 60)
                      )}h`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="not-interested">Not Interested</option>
            <option value="closed">Closed</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="listing">Listing Inquiries</option>
            <option value="general">General Inquiries</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Date Created</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="inquirerName">Name</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Status Count Badges */}
        {counts && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {counts.status &&
              Object.entries(counts.status).map(([status, count]) => (
                <span
                  key={status}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    status
                  )}`}
                >
                  {status}: {count}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {leadsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading leads...</p>
        </div>
      ) : leadsError ? (
        <div className="text-center py-12 text-red-500 bg-white rounded-lg shadow-sm border">
          <Users className="w-12 h-12 mx-auto mb-4 text-red-300" />
          <p className="font-medium">Error loading leads</p>
          <p className="text-sm mt-2">{leadsError}</p>
          <button
            onClick={() => getPropertyLeads(currentPage)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : propLeads?.length > 0 ? (
        <Fragment>
          {/* Results Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(
                    currentPage * limit,
                    pagination?.totalInquiries || 0
                  )}{" "}
                  of {pagination?.totalInquiries || 0} leads
                </p>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads List */}
          <div className="space-y-4">
            {propLeads.map((lead) => (
              <div
                key={lead._id}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {lead.inquirerName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          lead.priority
                        )}`}
                      >
                        {lead.priority || "medium"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {lead.listingId?.title || "General Inquiry"}
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
                        {lead.listingId?.propertyType || "General"}
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
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span>Source: {lead.source || "Web"}</span>
                    {lead.respondedAt && (
                      <span className="text-green-600">
                        Responded:{" "}
                        {new Date(lead.respondedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {lead.message && (
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border mb-4">
                    <strong>Message:</strong> {lead.message}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Contact
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(lead._id, "contacted")}
                    disabled={
                      updatingStatus === lead._id || lead.status === "contacted"
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

                  {lead.listingId?._id && (
                    <Link
                      href={`/properties/${lead.listingId._id}`}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Property
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            pageNum === currentPage
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm border">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="font-medium">No leads found</p>
          {(searchTerm ||
            filterStatus ||
            filterType ||
            filterPriority ||
            dateFrom ||
            dateTo) && (
            <p className="text-sm mt-2">
              Try adjusting your search or filter criteria
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;
