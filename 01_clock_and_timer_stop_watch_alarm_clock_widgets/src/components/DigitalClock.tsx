"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GoBack from "./GoBack"; // Assuming you have a reusable GoBack component

export default function DigitalClock() {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(() => {
    if (!mounted) return "";
    const hours = is24Hour
      ? time.getHours().toString().padStart(2, "0")
      : (time.getHours() % 12 || 12).toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [time, is24Hour, mounted]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-900 via-black to-blue-900 p-6">
      {/* Go Back Button on the Left */}
      <div className="absolute top-6 left-6">
        <GoBack />
      </div>

      <Card className="p-10 max-w-xl w-full rounded-3xl border border-gradient-to-r border-purple-500/70 bg-gradient-to-br from-purple-900/70 via-indigo-900/70 to-blue-900/70 shadow-[0_0_30px_rgba(139,92,246,0.6)]">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] select-none">
            Digital Clock
          </h1>
          <p className="text-sm text-indigo-300 mb-8 text-center select-none">
            Display current time in hours, minutes, and seconds.
          </p>
          <div
            className="text-5xl font-mono font-extrabold tracking-widest select-none
              bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400
              text-transparent bg-clip-text
              drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]
              mb-10"
            style={{ letterSpacing: "0.3em" }}
          >
            {formattedTime}
          </div>
          <div className="flex space-x-6">
            {/* 24-Hour Format Button */}
            <Button
              onClick={() => setIs24Hour(true)}
              className={`font-semibold px-8 py-3 shadow-lg transition duration-300 select-none
                ${
                  is24Hour
                    ? "bg-transparent/5 text-purple-600 hover:bg-transparent/30 rounded-xl"
                    : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white hover:brightness-110 rounded-xl"
                }`}
            >
              24-Hour Format
            </Button>

            {/* 12-Hour Format Button */}
            <Button
              onClick={() => setIs24Hour(false)}
              className={`font-semibold px-8 py-3 shadow-lg transition duration-300 select-none
                ${
                  !is24Hour
                    ? "bg-transparent/5 text-purple-600 hover:bg-transparent/30 rounded-xl"
                    : "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white hover:brightness-110 rounded-xl"
                }`}
            >
              12-Hour Format
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
