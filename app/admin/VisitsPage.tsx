"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  User,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { schedulesApi } from "@/api/schedulesApi";
import { Schedule } from "@/models/schedules";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/app/components/pagination";

export default function VisitsPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    currentData,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({
    data: schedules,
    initialItemsPerPage: 10,
  });

  useEffect(() => {
    fetchDoneSchedules();
  }, []);

  const fetchDoneSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await schedulesApi.getByStatus("done");

      if (response.success && response.data) {
        setSchedules(response.data);
      } else {
        throw new Error("Failed to fetch schedules");
      }
    } catch (err: any) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Completed Schedules
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Loading..."
              : `${schedules.length} completed inspection${
                  schedules.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>
        <button
          onClick={fetchDoneSchedules}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-green-700 mb-4" size={48} />
          <p className="text-gray-600">Loading completed schedules...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
          <AlertCircle
            className="text-red-500 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div className="flex-1">
            <p className="text-red-800 font-semibold">
              Error Loading Schedules
            </p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchDoneSchedules}
              className="mt-3 text-sm text-red-700 font-medium hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && schedules.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <CheckCircle size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Completed Schedules
          </h2>
          <p className="text-gray-600">
            No inspection schedules have been completed yet.
          </p>
        </div>
      )}

      {/* Schedules Table */}
      {!loading && !error && schedules.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Farmer
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      PCIC ID
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Scheduled Date
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Completed Date
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentData.map((schedule) => (
                    <tr
                      key={schedule.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={18} className="text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {schedule.farmers?.fname}{" "}
                              {schedule.farmers?.lname}
                            </p>
                            <p className="text-sm text-gray-500">
                              {schedule.farmers?.address}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-green-700 font-semibold">
                        {schedule.farmers?.pcicid}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-gray-800">
                            {formatDate(schedule.scheduled_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-gray-600 text-sm">
                            {formatDateTime(schedule.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          <CheckCircle size={16} />
                          <span className="font-semibold text-sm">Done</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedSchedule(schedule)}
                          className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={schedules.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              showItemsPerPage={true}
              itemsPerPageOptions={[5, 10, 25, 50]}
            />
          </div>
        </>
      )}

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                Schedule Details
              </h2>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle size={32} className="text-green-700" />
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-xl font-bold text-green-700">Completed</p>
                </div>
              </div>

              {/* Farmer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-green-700" />
                  Farmer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-800">
                      {selectedSchedule.farmers?.fname}{" "}
                      {selectedSchedule.farmers?.lname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">PCIC ID</p>
                    <p className="font-semibold text-green-700">
                      {selectedSchedule.farmers?.pcicid}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact</p>
                    <p className="font-semibold text-gray-800">
                      {selectedSchedule.farmers?.contact || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-semibold text-gray-800">
                      {selectedSchedule.farmers?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-green-700" />
                  Schedule Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Scheduled Date:</span>
                    <span className="font-semibold text-gray-800">
                      {formatDate(selectedSchedule.scheduled_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Created Date:</span>
                    <span className="font-semibold text-gray-800">
                      {formatDateTime(selectedSchedule.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedSchedule.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-blue-700" />
                    Notes
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedSchedule.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() =>
                    router.push(`/farmers/${selectedSchedule.farmer_id}`)
                  }
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  View Farmer Profile
                </button>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
