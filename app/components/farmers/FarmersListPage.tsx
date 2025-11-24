"use client";

import React, { useState } from "react";
import { ArrowLeft, MoreVertical, X, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Farmer = {
  id: number;
  pcicId: string;
  firstName: string;
  lastName: string;
  contact: string;
  address: string;
};

export default function FarmersListPage() {
  const router = useRouter();
  const [farmers] = useState<Farmer[]>([
    {
      id: 1,
      pcicId: "PCIC-001",
      firstName: "Juan",
      lastName: "Dela Cruz",
      contact: "09123456789",
      address: "Cebu City",
    },
    {
      id: 2,
      pcicId: "PCIC-002",
      firstName: "Maria",
      lastName: "Santos",
      contact: "09198765432",
      address: "Mandaue City",
    },
    {
      id: 3,
      pcicId: "PCIC-003",
      firstName: "Pedro",
      lastName: "Reyes",
      contact: "09187654321",
      address: "Lapu-Lapu City",
    },
  ]);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  return (
    <div>
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Registered Farmers
        </h1>
        <p className="text-gray-600">{farmers.length} farmers registered</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">PCIC ID</th>
                <th className="px-6 py-4 text-left font-semibold">Last Name</th>
                <th className="px-6 py-4 text-left font-semibold">
                  First Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">Contact</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {farmers.map((farmer) => (
                <tr
                  key={farmer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-green-700 font-semibold">
                    {farmer.pcicId}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{farmer.lastName}</td>
                  <td className="px-6 py-4 text-gray-800">
                    {farmer.firstName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{farmer.contact}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedFarmer(farmer)}
                      className="text-green-700 hover:bg-green-50 p-2 rounded-lg"
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

      {selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-green-700">
                Farmer Details
              </h2>
              <button
                onClick={() => setSelectedFarmer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.firstName} {selectedFarmer.lastName}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">PCIC ID</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.pcicId}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Contact</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.contact}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="font-semibold text-gray-800">
                  {selectedFarmer.address}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 flex items-center justify-center gap-2">
                <Edit size={18} />
                Edit
              </button>
              <button className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 flex items-center justify-center gap-2">
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
