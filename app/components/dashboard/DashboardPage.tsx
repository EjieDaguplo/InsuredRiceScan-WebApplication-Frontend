"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  UserPlus,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import QuickActionCard from "./QuickActionCard";
import { useRouter } from "next/navigation";
import { farmersApi } from "@/api/farmersApi";
import { schedulesApi } from "@/api/schedulesApi";
import { claimsevidenceApi } from "@/api/claimEvidenceApi";

interface DashboardStats {
  totalFarmers: number;
  activeClaims: number;
  scheduledVisits: number;
  completedSchedules: number;
}

function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalFarmers: 0,
    activeClaims: 0,
    scheduledVisits: 0,
    completedSchedules: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel using our API service
      const [farmersData, scheduleStatsData, evidenceData] = await Promise.all([
        farmersApi.getAll(),
        schedulesApi.getStats(), // Use the new stats endpoint!
        claimsevidenceApi.getUnlinked(), // Get unlinked evidence for active claims
      ]);

      // Calculate stats
      const totalFarmers = farmersData.count || 0;

      // Active claims = evidence that hasn't been linked to a schedule yet
      const activeClaims = evidenceData.count || 0;

      // Get scheduled visits and completed from stats endpoint
      const scheduledVisits = scheduleStatsData.data?.pending || 0;
      const completedSchedules = scheduleStatsData.data?.done || 0;

      setStats({
        totalFarmers,
        activeClaims,
        scheduledVisits,
        completedSchedules,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Failed to load dashboard data. Please check if the backend server is running on http://localhost:3000"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      label: "Total Farmers",
      value: loading ? "..." : stats.totalFarmers.toString(),
      icon: Users,
      color: "bg-blue-500",
      href: "/farmers",
    },
    {
      label: "Active Claims",
      value: loading ? "..." : stats.activeClaims.toString(),
      icon: FileText,
      color: "bg-orange-500",
      href: "/claims",
    },
    {
      label: "Scheduled Visits",
      value: loading ? "..." : stats.scheduledVisits.toString(),
      icon: Calendar,
      color: "bg-purple-500",
      href: "/visits",
    },
    {
      label: "Completed",
      value: loading ? "..." : stats.completedSchedules.toString(),
      icon: CheckCircle,
      color: "bg-green-500",
      href: "/check",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">Manage farmers, claims, and inspections</p>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle
            className="text-red-500 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div className="flex-1">
            <p className="text-red-800 font-semibold">
              Error Loading Dashboard
            </p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-3 text-sm text-red-700 font-medium hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => !loading && router.push(stat.href)}
              className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer ${
                loading ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Farmer CTA */}
      <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-4">
              <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">New Farmers?</h2>
            <p className="text-green-100 mb-6">
              Create farmer accounts and manage registrations
            </p>
            <button
              onClick={() => router.push("/add-farmer")}
              className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center gap-2"
            >
              <UserPlus size={20} />
              Add Farmer
            </button>
          </div>
          <div className="hidden lg:block">
            <Users size={120} className="text-white opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={Users}
            label="Farmers"
            color="bg-blue-500"
            onClick={() => router.push("/farmers")}
          />
          <QuickActionCard
            icon={FileText}
            label="Claims"
            color="bg-orange-500"
            onClick={() => router.push("/claims")}
          />
          <QuickActionCard
            icon={Calendar}
            label="Visit"
            color="bg-purple-500"
            onClick={() => router.push("/visits")}
          />
          <QuickActionCard
            icon={CheckCircle}
            label="Check"
            color="bg-green-500"
            onClick={() => router.push("/check")}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
