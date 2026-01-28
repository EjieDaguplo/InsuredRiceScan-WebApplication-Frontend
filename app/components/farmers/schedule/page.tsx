"use client";

import { ArrowLeft, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/farmer-dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="p-16 text-center pt-50">
        <Construction size={80} className="mx-auto text-orange-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Under Development
        </h1>
        <p className="text-lg text-gray-600">
          This feature is currently being built and will be available soon.
        </p>
      </div>
    </div>
  );
}
