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
  const [properties, setProperties] = useState([]);
  const [viewModal, setViewModal] = useState({ open: false, property: null });
  const [editModal, setEditModal] = useState({ open: false, property: null });
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    property: null,
  });

  useEffect(() => {
    const getUserProperties = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const res = await axiosInstance.get("/listings/my-listings");
        // console.log(res?.data?.data);
        setProperties(res?.data?.data?.listings);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    getUserProperties();
  }, [activeTab]);

  const handleView = (property) => {
    setViewModal({ open: true, property });
  };

  // Handle edit property
  const handleEdit = (property) => {
    setEditModal({ open: true, property: { ...property } });
  };

  // Handle delete property
  const handleDelete = (property) => {
    setDeleteModal({ open: true, property });
  };

  // Save edited property
  const saveEdit = () => {
    setProperties((prev) =>
      prev.map((p) => (p.id === editModal.property.id ? editModal.property : p))
    );
    setEditModal({ open: false, property: null });
  };

  // Update edit form
  const updateEditForm = (field, value) => {
    setEditModal((prev) => ({
      ...prev,
      property: {
        ...prev.property,
        [field]: value,
      },
    }));
  };

  // Update nested edit form
  const updateNestedEditForm = (section, field, value) => {
    setEditModal((prev) => ({
      ...prev,
      property: {
        ...prev.property,
        [section]: {
          ...prev.property[section],
          [field]: value,
        },
      },
    }));
  };

  const confirmDelete = () => {
    setProperties((prev) =>
      prev.filter((p) => p.id !== deleteModal.property.id)
    );
    setDeleteModal({ open: false, property: null });
  };

  // console.log(viewModal);

  const getPropertyStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sold":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Rented":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
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
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
            Property Management
          </h2>
          <Link
            href="/post-property"
            className="bg-blue-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg flex items-center space-x-1 lg:space-x-2 hover:bg-blue-700 transition-colors text-sm lg:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Property</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>

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

        {/* Properties List */}
        {activeTab === "properties" && (
          <div className="space-y-3 lg:space-y-4">
            {properties?.length > 0 ? (
              properties?.map((property) => (
                <div
                  key={property.id}
                  className="bg-gray-50 p-3 lg:p-4 rounded-lg border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base pr-2 flex-1 min-w-0">
                      <span className="truncate block">{property.title}</span>
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getPropertyStatusColor(
                        property.status
                      )}`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs lg:text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{property.price}</span>
                    </div>
                    <div className="flex items-center space-x-2 lg:space-x-4 flex-wrap">
                      <span>{property.bedrooms} BHK</span>
                      <span>{property.area}</span>
                      <span className="capitalize">
                        {property.propertyType}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1 flex-wrap gap-1">
                    <button
                      onClick={() => handleView(property)}
                      className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      className="flex items-center px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property)}
                      className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>

                  {/* View Modal */}

                  {viewModal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-2 ">
                      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold text-gray-900">
                            Property Details
                          </h2>
                          <button
                            onClick={() =>
                              setViewModal({ open: false, property: null })
                            }
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {viewModal.property && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {viewModal.property.title}
                              </h3>
                              <p className="text-gray-600">
                                {viewModal.property.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Property Type
                                </h4>
                                <p className="text-gray-600">
                                  {viewModal.property.propertyType}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Listing Type
                                </h4>
                                <p className="text-gray-600 capitalize">
                                  {viewModal.property.type}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">
                                Location
                              </h4>
                              <p className="text-gray-600">
                                {viewModal.property.location}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">
                                Price
                              </h4>
                              <p className="text-gray-600">
                                {FormatPrice(
                                  viewModal.property.price,
                                  viewModal.property.priceType
                                )}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Bedrooms
                                </h4>
                                <p className="text-gray-600">
                                  {viewModal.property.bedrooms}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Bathrooms
                                </h4>
                                <p className="text-gray-600">
                                  {viewModal.property.bathrooms}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Area
                                </h4>
                                <p className="text-gray-600">
                                  {viewModal.property.area}{" "}
                                  {viewModal.property.areaUnit}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Parking
                                </h4>
                                <p className="text-gray-600">
                                  {viewModal.property.parking} spaces
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">
                                Furnishing
                              </h4>
                              <p className="text-gray-600">
                                {viewModal.property.furnishing}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900">
                                Amenities
                              </h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {viewModal.property.amenities.map(
                                  (amenity, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                                    >
                                      {amenity}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <h4 className="font-medium text-gray-900 mb-2">
                                Contact Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-700">
                                    Contact Person:
                                  </span>
                                  <span className="ml-2 text-gray-600">
                                    {viewModal.property.contactPerson}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-gray-600">
                                    {viewModal.property.phoneNumber}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-gray-600">
                                    {viewModal.property.email}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-700">
                                    User Type:
                                  </span>
                                  <span className="ml-2 text-gray-600 capitalize">
                                    {viewModal.property.userType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit Modal */}
                  {editModal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-2">
                      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-gray-900">
                            Edit Property
                          </h2>
                          <button
                            onClick={() =>
                              setEditModal({ open: false, property: null })
                            }
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {editModal.property && (
                          <form className="space-y-6">
                            {/* Title */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Property Title
                              </label>
                              <input
                                type="text"
                                value={editModal.property.title}
                                onChange={(e) =>
                                  updateEditForm("title", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter property title"
                              />
                            </div>

                            {/* Description */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                              </label>
                              <textarea
                                value={editModal.property.description}
                                onChange={(e) =>
                                  updateEditForm("description", e.target.value)
                                }
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe your property..."
                              />
                            </div>

                            {/* Property Details Section */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Property Details
                              </h3>

                              {/* Price and Bedrooms */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">
                                      ₹
                                    </span>
                                    <input
                                      type="number"
                                      value={editModal.property.price}
                                      onChange={(e) =>
                                        updateNestedEditForm(
                                          "pricing",
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bedrooms
                                  </label>
                                  <input
                                    type="number"
                                    value={editModal.property.bedrooms}
                                    onChange={(e) =>
                                      updateNestedEditForm(
                                        "details",
                                        "bedrooms",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="0"
                                    min="0"
                                  />
                                </div>
                              </div>

                              {/* Bathrooms */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bathrooms
                                  </label>
                                  <input
                                    type="number"
                                    value={editModal.property.bathrooms}
                                    onChange={(e) =>
                                      updateNestedEditForm(
                                        "details",
                                        "bathrooms",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="0"
                                    min="0"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Contact Information Section */}
                            <div className="bg-blue-50 p-6 rounded-lg">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Contact Information
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Person
                                  </label>
                                  <input
                                    type="text"
                                    value={editModal.property.contactPerson}
                                    onChange={(e) =>
                                      updateNestedEditForm(
                                        "contact",
                                        "contactPerson",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter contact person name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                  </label>
                                  <input
                                    type="text"
                                    value={editModal.property.phoneNumber}
                                    onChange={(e) =>
                                      updateNestedEditForm(
                                        "contact",
                                        "phoneNumber",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter phone number"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditModal({
                                    open: false,
                                    property: null,
                                  })
                                }
                                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={saveEdit}
                                className="flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delete Modal */}
                  {deleteModal.open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
                      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                              </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                              Delete Property
                            </h2>
                          </div>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: false,
                                property: null,
                              })
                            }
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mb-8">
                          <p className="text-gray-600 mb-3">
                            Are you sure you want to delete this property?
                          </p>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-800 font-medium">
                              Property:{" "}
                              <span className="font-normal">
                                "{deleteModal.property?.title}"
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                              />
                            </svg>
                            <span>This action cannot be undone.</span>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: false,
                                property: null,
                              })
                            }
                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDelete}
                            className="px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-md hover:shadow-lg"
                          >
                            Delete Property
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No properties found</p>
                {searchTerm && (
                  <p className="text-sm mt-2">Try adjusting your search term</p>
                )}
              </div>
            )}
          </div>
        )}

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

            <div className="grid grid-cols-2 gap-3 lg:gap-4 pt-4 border-t">
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
            </div>

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
