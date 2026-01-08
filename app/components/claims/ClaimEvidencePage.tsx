"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  MapPin,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { claimsevidenceApi } from "@/api/claimEvidenceApi";
import { Evidence, EvidenceGroupedByFarmer } from "@/models/claimEvidence";

function ClaimEvidencePage() {
  const router = useRouter();
  const [groupedEvidence, setGroupedEvidence] = useState<
    EvidenceGroupedByFarmer[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Fetch all evidence and group by farmer
  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching evidence...");
      const response = await claimsevidenceApi.getAll();

      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response count:", response.count);

      if (response.success && response.data) {
        // setDebugInfo(`Received ${response.data.length} evidence items`);

        // Group evidence by farmer
        const grouped = groupEvidenceByFarmer(response.data);
        // console.log("Grouped evidence:", grouped);

        setGroupedEvidence(grouped);
      } else {
        throw new Error("Failed to fetch evidence");
      }
    } catch (err: any) {
      console.error("Error fetching evidence:", err);
      setError(`Failed to load evidence: ${err.message}`);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const groupEvidenceByFarmer = (
    evidences: Evidence[]
  ): EvidenceGroupedByFarmer[] => {
    console.log("Grouping evidences:", evidences.length);
    const farmerMap = new Map<string, EvidenceGroupedByFarmer>();

    evidences.forEach((evidence, index) => {
      console.log(`Evidence ${index}:`, {
        id: evidence.id,
        farmer_id: evidence.farmer_id,
        has_farmers: !!evidence.farmer,
        farmers: evidence.farmer,
      });

      // Skip if no farmer_id or no farmer data
      if (!evidence.farmer_id) {
        console.log(`Skipping evidence ${index}: No farmer_id`);
        return;
      }

      if (!evidence.farmer) {
        console.log(`Skipping evidence ${index}: No farmers object`);
        return;
      }

      if (!farmerMap.has(evidence.farmer_id)) {
        farmerMap.set(evidence.farmer_id, {
          farmer: evidence.farmer,
          evidences: [],
          schedule: evidence.claim_schedules || null,
        });
      }

      farmerMap.get(evidence.farmer_id)?.evidences.push(evidence);
    });

    console.log("FarmerMap size:", farmerMap.size);

    // Convert to array and sort by farmer name
    const result = Array.from(farmerMap.values()).sort((a, b) =>
      `${a.farmer.fname} ${a.farmer.lname}`.localeCompare(
        `${b.farmer.fname} ${b.farmer.lname}`
      )
    );

    console.log("Final grouped result:", result.length, "farmers");
    return result;
  };

  return (
    <div>
      {/* Header */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Claim Evidence
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Loading..."
              : `${groupedEvidence.length} farmers with evidence`}
          </p>
          {debugInfo && (
            <p className="text-xs text-blue-600 mt-1">Debug: {debugInfo}</p>
          )}
        </div>
        <button
          onClick={fetchEvidence}
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
          <p className="text-gray-600">Loading evidence...</p>
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
            <p className="text-red-800 font-semibold">Error Loading Evidence</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchEvidence}
              className="mt-3 text-sm text-red-700 font-medium hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && groupedEvidence.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Evidence Found
          </h2>
          <p className="text-gray-600">
            No claim evidence has been submitted yet.
          </p>
          <button
            onClick={fetchEvidence}
            className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
          >
            Reload Evidence
          </button>
        </div>
      )}

      {/* Evidence List */}
      {!loading && !error && groupedEvidence.length > 0 && (
        <div className="space-y-6">
          {groupedEvidence.map((group) => (
            <FarmerEvidenceCard
              key={group.farmer.id}
              group={group}
              onDelete={() => fetchEvidence()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FarmerEvidenceCardProps {
  group: EvidenceGroupedByFarmer;
  onDelete: () => void;
}

function FarmerEvidenceCard({ group, onDelete }: FarmerEvidenceCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { farmer, evidences, schedule } = group;
  const currentEvidence = evidences[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % evidences.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + evidences.length) % evidences.length
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteAll = async () => {
    try {
      // Delete each evidence image for this farmer
      const deletePromises = evidences.map((evidence) =>
        claimsevidenceApi.delete(evidence.id)
      );

      await Promise.all(deletePromises);

      alert(
        `Successfully deleted ${evidences.length} evidence images for ${farmer.fname} ${farmer.lname}`
      );
      setShowDeleteDialog(false);
      onDelete(); // Refresh the list
    } catch (error) {
      console.error("Error deleting evidence:", error);
      alert("Failed to delete evidence. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Farmer Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full p-3">
              <User size={24} className="text-green-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {farmer.fname} {farmer.lname}
              </h3>
              <p className="text-green-100 text-sm">PCIC ID: {farmer.pcicid}</p>
              {farmer.address && (
                <p className="text-green-100 text-sm">{farmer.address}</p>
              )}
              <p className="text-green-100 text-xs mt-1">
                {evidences.length} evidence image
                {evidences.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3">
            {schedule?.status === "done" ? (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <CheckCircle size={20} className="text-white" />
                <span className="text-white font-semibold">Done</span>
              </div>
            ) : schedule?.status === "pending" ? (
              <div className="bg-orange-500 bg-opacity-90 px-4 py-2 rounded-lg flex items-center gap-2">
                <Clock size={20} className="text-white" />
                <span className="text-white font-semibold">Pending</span>
              </div>
            ) : (
              <div className="bg-gray-500 bg-opacity-90 px-4 py-2 rounded-lg">
                <span className="text-white font-semibold text-sm">
                  No Schedule
                </span>
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
              title="Delete all evidence"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Carousel */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video">
              {evidences.length > 0 ? (
                <>
                  <img
                    src={currentEvidence.image_url}
                    alt="Evidence"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // console.error(
                      //   "Image failed to load:",
                      //   currentEvidence.image_url
                      // );
                      e.currentTarget.src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23ddd" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%23999">Image not available</text></svg>';
                    }}
                  />

                  {/* Navigation Arrows */}
                  {evidences.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {evidences.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Thumbnail Dots */}
            {evidences.length > 1 && (
              <div className="flex justify-center gap-2">
                {evidences.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-green-700 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Evidence Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Captured Date & Time</p>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-green-700" />
                <p className="font-semibold text-gray-800">
                  {formatDate(currentEvidence.captured_at)}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-green-700" />
                <p className="font-semibold text-gray-800">
                  {currentEvidence.address || "Address not available"}
                </p>
              </div>
              {currentEvidence.latitude && currentEvidence.longitude && (
                <p className="text-sm text-gray-600 mt-2">
                  Coordinates: {currentEvidence.latitude.toFixed(6)},{" "}
                  {currentEvidence.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {/* Schedule Information */}
            {schedule && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-500 mb-2">
                  Schedule Information
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(schedule.scheduled_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        schedule.status === "done"
                          ? "text-green-700"
                          : "text-orange-600"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </div>
                  {schedule.notes && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-sm text-gray-600">Notes:</p>
                      <p className="text-sm text-gray-800 mt-1">
                        {schedule.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {currentEvidence.latitude && currentEvidence.longitude && (
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${currentEvidence.latitude},${currentEvidence.longitude}`,
                      "_blank"
                    )
                  }
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin size={20} />
                  View on Map
                </button>
              )}

              {!schedule && (
                <button
                  onClick={() =>
                    router.push(`/schedules/create?farmerId=${farmer.id}`)
                  }
                  className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Calendar size={20} />
                  Set Schedule
                </button>
              )}

              {schedule?.status === "pending" && (
                <button
                  onClick={() => router.push(`/schedules/edit/${schedule.id}`)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit size={20} />
                  Edit Schedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Delete All Evidence
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all {evidences.length} evidence
              images for{" "}
              <strong>
                {farmer.fname} {farmer.lname}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaimEvidencePage;
