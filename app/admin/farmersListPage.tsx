"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MoreVertical,
  X,
  Edit,
  Trash2,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { farmersApi } from "@/api/farmersApi";
import { Farmer } from "@/models/farmers";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/app/components/pagination";

export default function FarmersListPage() {
  const router = useRouter();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Use pagination hook
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    currentData,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: filteredFarmers,
    initialItemsPerPage: 10,
    resetOnDataChange: true,
  });

  // Fetch farmers from API
  const fetchFarmers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await farmersApi.getAll();

      if (response.success && response.data) {
        setFarmers(response.data);
        setFilteredFarmers(response.data);
      } else {
        throw new Error("Failed to fetch farmers");
      }
    } catch (err) {
      console.error("Error fetching farmers:", err);
      setError(
        "Failed to load farmers. Please check if the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFarmers();
  }, []);

  // Filter farmers based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFarmers(farmers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = farmers.filter(
        (farmer) =>
          farmer.fname?.toLowerCase().includes(query) ||
          farmer.lname?.toLowerCase().includes(query) ||
          farmer.pcicid?.toLowerCase().includes(query) ||
          farmer.contact?.toLowerCase().includes(query) ||
          farmer.address?.toLowerCase().includes(query),
      );
      setFilteredFarmers(filtered);
    }
  }, [searchQuery, farmers]);

  // Handle delete farmer
  const handleDeleteFarmer = async () => {
    if (!selectedFarmer) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedFarmer.fname} ${selectedFarmer.lname}? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);

      const response = await farmersApi.delete(selectedFarmer.pcicid);

      if (response.success) {
        // Remove farmer from local state
        setFarmers((prev) => prev.filter((f) => f.id !== selectedFarmer.id));
        setSelectedFarmer(null);
        alert("Farmer deleted successfully!");
      } else {
        throw new Error("Failed to delete farmer");
      }
    } catch (err) {
      console.error("Error deleting farmer:", err);
      alert("Failed to delete farmer. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle edit farmer
  const handleEditFarmer = () => {
    if (selectedFarmer) {
      router.push(`/farmers/edit/${selectedFarmer.id}`);
    }
  };

  return (
    <div className="w-full">
      {/* Header with Back Button */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {/* Page Title and Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Registered Farmers
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Loading..."
              : `${filteredFarmers.length} farmers registered`}
          </p>
        </div>

        <button
          onClick={fetchFarmers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, PCIC ID, contact, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle
            className="text-red-500 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div className="flex-1">
            <p className="text-red-800 font-semibold">Error Loading Farmers</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchFarmers}
              className="mt-3 text-sm text-red-700 font-medium hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-green-700 mb-4" size={48} />
          <p className="text-gray-600">Loading farmers...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredFarmers.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            {searchQuery
              ? "No farmers found matching your search"
              : "No farmers registered yet"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => router.push("/add-farmer")}
              className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
            >
              Add First Farmer
            </button>
          )}
        </div>
      )}

      {/* Farmers Table */}
      {!loading && !error && filteredFarmers.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      PCIC ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Last Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      First Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Middle Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.map((farmer) => (
                    <tr
                      key={farmer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-green-700 font-semibold">
                        {farmer.pcicid}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {farmer.lname}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {farmer.fname}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {farmer.mname || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {farmer.contact || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {farmer.address || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedFarmer(farmer)}
                          className="text-green-700 hover:bg-green-50 p-2 rounded-lg transition-colors"
                        >
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Component */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredFarmers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              showItemsPerPage={true}
              itemsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </div>
        </>
      )}

      {/* Farmer Details Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                Farmer Details
              </h2>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.fname} {selectedFarmer.mname || ""}{" "}
                  {selectedFarmer.lname}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">PCIC ID</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.pcicid}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Contact</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.contact || "Not provided"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.address || "Not provided"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Registered Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(selectedFarmer.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditFarmer}
                className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 flex items-center justify-center gap-2 transition-colors"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={handleDeleteFarmer}
                disabled={deleteLoading}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
