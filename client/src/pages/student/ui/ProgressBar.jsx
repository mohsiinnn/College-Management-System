import React from "react";

export default function ProgressBar({ value = 0, label = "" }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="w-7/8 justify-center items-center text-center">
      {label ? (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{pct}%</span>
        </div>
      ) : null}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${pct}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          role="progressbar"
        />
      </div>
    </div>
  );
}
