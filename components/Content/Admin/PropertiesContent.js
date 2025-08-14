import React, { useState, useEffect } from "react";
import {
  Home,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Shield,
  Crown,
  MapPin,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import Image from "next/image";

const PropertiesContent = ({
  properties = [],
  loading = false,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [localProperties, setLocalProperties] = useState(properties);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    setLocalProperties(properties);
  }, [properties]);

  const updatePropertyStatus = async (propertyId, field, value) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`/api/admin/listings/${propertyId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      const data = await response.json();
      if (data.success) {
        setLocalProperties(
          localProperties.map((property) =>
            property._id === propertyId
              ? { ...property, [field]: value }
              : property
          )
        );
      }
    } catch (error) {
      console.error(`Error updating property ${field}:`, error);
      // For demo, update locally
      setLocalProperties(
        localProperties.map((property) =>
          property._id === propertyId
            ? { ...property, [field]: value }
            : property
        )
      );
    }
  };

  const handleBulkUpdate = async (updateData) => {
    if (selectedProperties.length === 0) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/admin/listings/bulk", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingIds: selectedProperties,
          updateData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setLocalProperties(
          localProperties.map((property) =>
            selectedProperties.includes(property._id)
              ? { ...property, ...updateData }
              : property
          )
        );
        setSelectedProperties([]);
        setShowBulkActions(false);
      }
    } catch (error) {
      console.error("Error bulk updating properties:", error);
    }
  };

  const StatusToggle = ({
    property,
    field,
    label,
    icon: Icon,
    activeColor = "green",
  }) => {
    const isActive = property[field];

    return (
      <button
        onClick={() => updatePropertyStatus(property._id, field, !isActive)}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
          isActive
            ? `bg-${activeColor}-100 text-${activeColor}-700 hover:bg-${activeColor}-200`
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
        title={`${isActive ? "Disable" : "Enable"} ${label}`}
      >
        <Icon size={14} />
        <span>{isActive ? "On" : "Off"}</span>
      </button>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: "green", text: "Approved" },
      pending: { color: "yellow", text: "Pending" },
      rejected: { color: "red", text: "Rejected" },
      archived: { color: "gray", text: "Archived" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}
      >
        {config.text}
      </span>
    );
  };

  const filteredProperties = localProperties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || property.status === filterStatus;
    const matchesType = !filterType || property.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // console.log(properties);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Properties Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage property listings, status, and features
          </p>
        </div>
        <button
          onClick={() => onAdd && onAdd({})}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Property
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Total Properties
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {localProperties.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {localProperties.filter((p) => p.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">
                {localProperties.filter((p) => p.isVerified).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Featured</p>
              <p className="text-2xl font-semibold text-gray-900">
                {localProperties.filter((p) => p.isFeatured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search properties..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="archived">Archived</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("");
              setFilterType("");
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedProperties.length} properties selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkUpdate({ isActive: true })}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkUpdate({ isActive: false })}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkUpdate({ isVerified: true })}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleBulkUpdate({ isFeatured: true })}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700"
                >
                  Feature
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProperties([]);
                setShowBulkActions(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-8 text-center">
            <Home size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600">
              No properties match your current filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedProperties.length === filteredProperties.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProperties(
                            filteredProperties.map((p) => p.id)
                          );
                        } else {
                          setSelectedProperties([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Controls
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProperties([
                              ...selectedProperties,
                              property._id,
                            ]);
                          } else {
                            setSelectedProperties(
                              selectedProperties.filter(
                                (id) => id !== property._id
                              )
                            );
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <Image
                            width={500}
                            height={500}
                            className="h-16 w-16 rounded-lg object-cover"
                            src={
                              property.images[0].url || "/api/placeholder/64/64"
                            }
                            alt={property.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin size={12} className="mr-1" />
                            {property.address}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <DollarSign size={12} className="mr-1" />
                            {property.price}
                          </div>
                          {property.owner && (
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <User size={10} className="mr-1" />
                              {property.owner}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {getStatusBadge(property.status)}
                        <div className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(
                            property.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-2 gap-2">
                        <StatusToggle
                          property={property}
                          field="isActive"
                          label="Active"
                          icon={property.isActive ? CheckCircle : XCircle}
                          activeColor="green"
                        />
                        <StatusToggle
                          property={property}
                          field="isVerified"
                          label="isVerified"
                          icon={Shield}
                          activeColor="blue"
                        />
                        <StatusToggle
                          property={property}
                          field="isFeatured"
                          label="Featured"
                          icon={Star}
                          activeColor="yellow"
                        />
                        <StatusToggle
                          property={property}
                          field="isPremium"
                          label="Premium"
                          icon={Crown}
                          activeColor="purple"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            // View property details
                            // console.log("View property:", property._id);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            onUpdate && onUpdate(property._id, property)
                          }
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Property"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this property?"
                              )
                            ) {
                              onDelete && onDelete(property._id);
                            }
                          }}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesContent;
