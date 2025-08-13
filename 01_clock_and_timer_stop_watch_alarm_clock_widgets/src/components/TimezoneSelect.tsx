"use client";

import type React from "react";

interface TimezoneSelectProps {
  value?: string;
  onChange?: (timezone: string) => void;
  className?: string;
}

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: "+00:00" },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: "-05:00" },
  { value: "America/Chicago", label: "Central Time (CT)", offset: "-06:00" },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: "-07:00" },
  {
    value: "America/Los_Angeles",
    label: "Pacific Time (PT)",
    offset: "-08:00",
  },
  { value: "America/Anchorage", label: "Alaska Time (AKT)", offset: "-09:00" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)", offset: "-10:00" },
  {
    value: "Europe/London",
    label: "Greenwich Mean Time (GMT)",
    offset: "+00:00",
  },
  {
    value: "Europe/Paris",
    label: "Central European Time (CET)",
    offset: "+01:00",
  },
  {
    value: "Europe/Berlin",
    label: "Central European Time (CET)",
    offset: "+01:00",
  },
  {
    value: "Europe/Rome",
    label: "Central European Time (CET)",
    offset: "+01:00",
  },
  { value: "Europe/Moscow", label: "Moscow Time (MSK)", offset: "+03:00" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)", offset: "+04:00" },
  {
    value: "Asia/Kolkata",
    label: "India Standard Time (IST)",
    offset: "+05:30",
  },
  {
    value: "Asia/Karachi",
    label: "Pakistan Standard Time (PST)",
    offset: "+05:00",
  },
  {
    value: "Asia/Shanghai",
    label: "China Standard Time (CST)",
    offset: "+08:00",
  },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", offset: "+09:00" },
  { value: "Asia/Seoul", label: "Korea Standard Time (KST)", offset: "+09:00" },
  {
    value: "Australia/Sydney",
    label: "Australian Eastern Time (AET)",
    offset: "+11:00",
  },
  {
    value: "Pacific/Auckland",
    label: "New Zealand Time (NZST)",
    offset: "+13:00",
  },
];

export default function TimezoneSelect({
  value = "UTC",
  onChange,
  className = "",
}: TimezoneSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-gray-900/80 border-2 border-gray-700 rounded-xl 
                   text-white font-medium text-base backdrop-blur-sm
                   focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none
                   hover:border-gray-600 transition-all duration-200
                   shadow-lg hover:shadow-xl
                   appearance-none cursor-pointer min-w-[280px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23fbbf24' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 12px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "16px",
        }}
      >
        {timezones.map((timezone) => (
          <option
            key={timezone.value}
            value={timezone.value}
            className="bg-gray-900 text-white py-2"
          >
            {timezone.label} ({timezone.offset})
          </option>
        ))}
      </select>

      {/* Glowing border effect */}
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-amber-300/20 
                      opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none
                      blur-sm -z-10"
      />
    </div>
  );
}
