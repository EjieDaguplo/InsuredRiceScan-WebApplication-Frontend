"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Camera,
  Activity,
  FileText,
  Calendar,
  Hand,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface FarmerStats {
  submittedEvidence: number;
  scheduledVisits: number;
  detectedDiseases: number;
  pendingClaims: number;
}

export default function FarmerDashboardPage() {
  const router = useRouter();
  const [farmerName, setFarmerName] = useState("Farmer");
  const [stats, setStats] = useState<FarmerStats>({
    submittedEvidence: 0,
    scheduledVisits: 0,
    detectedDiseases: 0,
    pendingClaims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("user_type");
    const userName = localStorage.getItem("user_name");

    if (userType !== "farmer") {
      router.push("/login");
      return;
    }

    if (userName) {
      setFarmerName(userName);
    }

    // Fetch farmer stats
    fetchFarmerStats();
  }, [router]);

  const fetchFarmerStats = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual API calls
      // Simulating API call
      setTimeout(() => {
        setStats({
          submittedEvidence: 12,
          scheduledVisits: 3,
          detectedDiseases: 2,
          pendingClaims: 1,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Detect crop diseases and get treatment recommendations
          </p>
        </div>
        <button
          onClick={fetchFarmerStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Hand size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Welcome {farmerName}!</h2>
            <p className="text-green-100 text-lg mt-1">
              Manage your farm and track your claims
            </p>
          </div>
        </div>
        <p className="text-white/95 text-base leading-relaxed">
          Detect crop diseases and get treatment recommendations instantly.
          Submit evidence for insurance claims and track your schedules.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          label="Submitted Evidence"
          value={loading ? "..." : stats.submittedEvidence.toString()}
          color="bg-blue-500"
        />
        <StatsCard
          icon={Calendar}
          label="Scheduled Visits"
          value={loading ? "..." : stats.scheduledVisits.toString()}
          color="bg-purple-500"
        />
        <StatsCard
          icon={Activity}
          label="Detected Diseases"
          value={loading ? "..." : stats.detectedDiseases.toString()}
          color="bg-orange-500"
        />
        <StatsCard
          icon={AlertCircle}
          label="Pending Claims"
          value={loading ? "..." : stats.pendingClaims.toString()}
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-green-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            icon={Camera}
            label="Take Evidence"
            description="Capture photos of crop damage"
            color="bg-blue-500"
            onClick={() => router.push("/farmers/capture-evidence")}
          />
          <QuickActionCard
            icon={Activity}
            label="Disease & Cure"
            description="Diagnose crop diseases"
            color="bg-orange-500"
            onClick={() => router.push("/farmers/disease-diagnosis")}
          />
          <QuickActionCard
            icon={FileText}
            label="Submitted Evidence"
            description="View your submissions"
            color="bg-green-500"
            onClick={() => router.push("/farmers/evidence")}
          />
          <QuickActionCard
            icon={Calendar}
            label="View Schedule"
            description="Check inspection dates"
            color="bg-purple-500"
            onClick={() => router.push("/farmers/schedule")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <ActivityItem
            title="Evidence Submitted"
            description="Field damage photos uploaded"
            time="2 hours ago"
            icon={FileText}
            iconColor="text-blue-500"
          />
          <ActivityItem
            title="Schedule Updated"
            description="Inspection scheduled for next week"
            time="1 day ago"
            icon={Calendar}
            iconColor="text-purple-500"
          />
          <ActivityItem
            title="Disease Detected"
            description="Rice blast identified - treatment recommended"
            time="3 days ago"
            icon={Activity}
            iconColor="text-orange-500"
          />
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({
  icon: Icon,
  label,
  description,
  color,
  onClick,
}: {
  icon: any;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 text-left group"
    >
      <div
        className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="text-gray-800 font-semibold text-lg mb-1">{label}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </button>
  );
}

// Activity Item Component
function ActivityItem({
  title,
  description,
  time,
  icon: Icon,
  iconColor,
}: {
  title: string;
  description: string;
  time: string;
  icon: any;
  iconColor: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className={`${iconColor} bg-white p-2 rounded-lg shadow-sm`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-2">{time}</p>
      </div>
    </div>
  );
}
