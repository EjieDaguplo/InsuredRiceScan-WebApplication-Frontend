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
  TrendingUp,
  Clock,
  CheckCircle as CheckIcon,
} from "lucide-react";

interface FarmerStats {
  submittedEvidence: number;
  scheduledVisits: number;
  detectedDiseases: number;
  pendingClaims: number;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  iconColor: string;
}

export default function FarmerDashboardPage() {
  const router = useRouter();
  const [farmerName, setFarmerName] = useState("Farmer");
  const [pcicId, setPcicId] = useState("");
  const [stats, setStats] = useState<FarmerStats>({
    submittedEvidence: 0,
    scheduledVisits: 0,
    detectedDiseases: 0,
    pendingClaims: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    [],
  );

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("user_type");
    const userName = localStorage.getItem("user_name");
    const userPcicId = localStorage.getItem("pcic_id");
    const userId = localStorage.getItem("user_id");

    if (userType !== "farmer" || !userId) {
      router.push("/login");
      return;
    }

    if (userName) {
      setFarmerName(userName);
    }
    if (userPcicId) {
      setPcicId(userPcicId);
    }

    // Fetch farmer stats
    fetchFarmerStats(userId);
  }, [router]);

  const fetchFarmerStats = async (farmerId: string) => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        "Content-Type": "application/json",
        "x-user-id": farmerId,
        "x-user-type": "farmer",
      };

      // Fetch evidence count
      let evidenceCount = 0;
      try {
        const evidenceResponse = await fetch(
          `http://localhost:3000/api/evidence/farmer/${farmerId}`,
          { headers },
        );
        if (evidenceResponse.ok) {
          const evidenceData = await evidenceResponse.json();
          evidenceCount = evidenceData.data?.length || 0;
        }
      } catch (err) {
        console.warn("Evidence endpoint not available:", err);
      }

      // Fetch schedules count
      let schedulesCount = 0;
      try {
        const schedulesResponse = await fetch(
          `http://localhost:3000/api/schedules/farmer/${farmerId}`,
          { headers },
        );
        if (schedulesResponse.ok) {
          const schedulesData = await schedulesResponse.json();
          const schedules = schedulesData.data || [];
          schedulesCount = schedules.filter(
            (s: any) => s.status === "pending",
          ).length;
        }
      } catch (err) {
        console.warn("Schedules endpoint not available:", err);
      }

      setStats({
        submittedEvidence: evidenceCount,
        scheduledVisits: schedulesCount,
        detectedDiseases: 0, // TODO: Connect to disease detection API
        pendingClaims: 0, // TODO: Connect to claims API
      });

      // Set recent activities (mock data for now)
      setRecentActivities([
        {
          id: "1",
          title: "Evidence Submitted",
          description: "Field damage photos uploaded successfully",
          time: "2 hours ago",
          icon: FileText,
          iconColor: "text-blue-500",
        },
        {
          id: "2",
          title: "Schedule Updated",
          description: "Inspection scheduled for next week",
          time: "1 day ago",
          icon: Calendar,
          iconColor: "text-purple-500",
        },
        {
          id: "3",
          title: "Disease Detected",
          description: "Rice blast identified - treatment recommended",
          time: "3 days ago",
          icon: Activity,
          iconColor: "text-orange-500",
        },
      ]);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError("Unable to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchFarmerStats(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Detect crop diseases and get treatment recommendations
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
              onClick={handleRefresh}
              className="mt-3 text-sm text-red-700 font-medium hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-green-700 to-green-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
            <Hand size={32} className="text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">Welcome {farmerName}!</h2>
            <p className="text-green-100 text-base mb-1">PCIC ID: {pcicId}</p>
            <p className="text-white/95 text-base leading-relaxed mt-4">
              Detect crop diseases and get treatment recommendations instantly.
              Submit evidence for insurance claims and track your schedules.
            </p>
          </div>

          {/* Decorative Element */}
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={48} className="text-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={FileText}
          label="Submitted Evidence"
          value={loading ? "..." : stats.submittedEvidence.toString()}
          color="bg-blue-500"
          trend="+12%"
        />
        <StatsCard
          icon={Calendar}
          label="Scheduled Visits"
          value={loading ? "..." : stats.scheduledVisits.toString()}
          color="bg-purple-500"
          trend="3 upcoming"
        />
        <StatsCard
          icon={Activity}
          label="Detected Diseases"
          value={loading ? "..." : stats.detectedDiseases.toString()}
          color="bg-orange-500"
          trend="All treated"
        />
        <StatsCard
          icon={AlertCircle}
          label="Pending Claims"
          value={loading ? "..." : stats.pendingClaims.toString()}
          color="bg-red-500"
          trend="In review"
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
            onClick={() => router.push("/farmer/capture-evidence")}
          />
          <QuickActionCard
            icon={Activity}
            label="Disease & Cure"
            description="Diagnose crop diseases"
            color="bg-orange-500"
            onClick={() => router.push("/farmer/disease-diagnosis")}
          />
          <QuickActionCard
            icon={FileText}
            label="Submitted Evidence"
            description="View your submissions"
            color="bg-green-500"
            onClick={() => router.push("/farmer/evidence")}
          />
          <QuickActionCard
            icon={Calendar}
            label="View Schedule"
            description="Check inspection dates"
            color="bg-purple-500"
            onClick={() => router.push("/farmer/schedule")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <button className="text-green-700 text-sm font-medium hover:text-green-800">
            View All
          </button>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <CheckIcon className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2 text-lg">
              💡 Pro Tips for Better Claims
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Take clear photos showing the entire affected area</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>Capture images in good lighting conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>
                  Submit evidence within 24 hours of damage occurrence
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span>
                  Include multiple angles for comprehensive documentation
                </span>
              </li>
            </ul>
          </div>
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
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
        {trend && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
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
function ActivityItem({ activity }: { activity: RecentActivity }) {
  const Icon = activity.icon;
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div
        className={`${activity.iconColor} bg-white p-2 rounded-lg shadow-sm`}
      >
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Clock size={12} />
          {activity.time}
        </p>
      </div>
    </div>
  );
}
