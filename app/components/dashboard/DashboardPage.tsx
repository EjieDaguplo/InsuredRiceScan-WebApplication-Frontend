"use client";

import React from "react";
import { Users, FileText, Calendar, CheckCircle, UserPlus } from "lucide-react";
import QuickActionCard from "./QuickActionCard";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const router = useRouter();

  const stats = [
    { label: "Total Farmers", value: "248", icon: Users, color: "bg-blue-500" },
    {
      label: "Active Claims",
      value: "42",
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      label: "Scheduled Visits",
      value: "15",
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      label: "Completed",
      value: "156",
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        {/* <h1 className="text-3xl font-bold text-green-700 mb-2">
          Dashboard Overview
        </h1> */}
        <p className="text-gray-600">Manage farmers, claims, and inspections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
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
