"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

function ClaimEvidencePage() {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Claim Evidence
        </h2>
        <p className="text-gray-600">View and manage farmer claim evidence</p>
      </div>
    </div>
  );
}
export default ClaimEvidencePage;
