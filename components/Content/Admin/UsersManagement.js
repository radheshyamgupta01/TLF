import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Shield,
  Star,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";

const UsersManagement = ({ activeTab }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [
    searchTerm,
    filterRole,
    filterStatus,
    currentPage,
    activeTab === "users",
  ]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filterRole && { role: filterRole }),
        ...(filterStatus && { isActive: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await axiosInstance.get(`/admin/users?${params}`);

      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, field, value) => {
    try {
      const response = await axiosInstance.patch(`/admin/users/${userId}`, {
        [field]: value,
      });

      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, [field]: value } : user
          )
        );
      }
    } catch (error) {
      console.error(`Error updating user ${field}:`, error);
      // For demo, update locally
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, [field]: value } : user
        )
      );
    }
  };

  const StatusToggle = ({
    user,
    field,
    label,
    icon: Icon,
    activeColor = "green",
  }) => {
    const isActive = user[field];

    return (
      <button
        onClick={() => updateUserStatus(user._id, field, !isActive)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? `bg-${activeColor}-100 text-${activeColor}-700 hover:bg-${activeColor}-200`
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
        title={`${isActive ? "Disable" : "Enable"} ${label}`}
      >
        <Icon size={16} />
        <span>{isActive ? "On" : "Off"}</span>
      </button>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "red", icon: Shield },
      broker: { color: "blue", icon: UserCheck },
      seller: { color: "green", icon: UserCheck },
      developer: { color: "purple", icon: UserCheck },
      buyer: { color: "gray", icon: Users },
    };
    const config = roleConfig[role] || roleConfig.user;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}
      >
        <Icon size={12} className="mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // console.log(users);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user accounts, roles, and permissions
          </p>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyers</option>
            <option value="admin">Admin</option>
            <option value="broker">Broker</option>
            <option value="seller">Seller</option>
            <option value="developer">Developer</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterRole("");
              setFilterStatus("");
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                              {user.avatar ? (
                                <Image
                                  width={100}
                                  height={100}
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={user.avatar}
                                  alt={user.name}
                                />
                              ) : (
                                <span className="text-white font-medium text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium capitalize text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <StatusToggle
                            user={user}
                            field="isActive"
                            label="Active"
                            icon={user.isActive ? CheckCircle : XCircle}
                            activeColor="green"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <StatusToggle
                            user={user}
                            field="isVerified"
                            label="Verified"
                            icon={Shield}
                            activeColor="blue"
                          />
                          <StatusToggle
                            user={user}
                            field="isFeatured"
                            label="Featured"
                            icon={Star}
                            activeColor="yellow"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
