"use client";

import React from "react";
type Props = {
  icon: React.ComponentType<any>;
  label: string;
  color?: string;
  onClick?: () => void;
};

export default function QuickActionCard({
  icon: Icon,
  label,
  color = "bg-gray-200",
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 group"
    >
      <div
        className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}
      >
        <Icon className="text-white" size={24} />
      </div>
      <p className="text-gray-800 font-semibold">{label}</p>
    </button>
  );
}
