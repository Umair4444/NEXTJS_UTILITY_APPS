"use client";

import React, { useEffect, useState } from "react";
import GoBack from "@/components/GoBack";
import TimezoneSelect from "./TimezoneSelect";
import { Globe } from "lucide-react";

const clockFaceImage =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=512&q=80";

export default function BeautifulAnalogClock() {
  const [time, setTime] = useState(new Date());
  // console.log(time);

  const [selectedTimezone, setSelectedTimezone] = useState("UTC");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeInTimezone = new Date(
        now.toLocaleString("en-US", { timeZone: selectedTimezone })
      );
      setTime(timeInTimezone);
    };

    updateTime();
    const timerId = setInterval(updateTime, 1000 / 60);
    return () => clearInterval(timerId);
  }, [selectedTimezone]); // Re-run when timezone changes

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondsDeg = seconds * 6;
  const minutesDeg = minutes * 6;
  const hoursDeg = hours * 30;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-900 via-black to-gray-900 px-4">
      <div className="absolute top-36 md:top-6 left-6">
        <GoBack />
      </div>

      <h1 className="text-4xl font-bold text-white text-nowrap mb-4 tracking-wide drop-shadow-lg">
        Elegant Analog Wall Clock
      </h1>
      <div className="flex flex-col gap-2 items-center justify-center">
        <div>
          {/* use select box here for selecting timezone */}
          <TimezoneSelect
            value={selectedTimezone}
            onChange={setSelectedTimezone}
            className="w-full overflow-hidden"
          />
        </div>
        <div
          className="relative rounded-full shadow-2xl border-2 border-gray-800 overflow-hidden
         w-[500px] h-[500px] scale-90"
          style={{
            backgroundImage: `url(${clockFaceImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow:
              "inset 0 0 60px rgba(255,255,255,0.2), 0 15px 30px rgba(0,0,0,0.7)",
          }}
        >
          {/* Center Dot */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 z-40 shadow-lg" />

          {/* Hour hand */}
          <div
            className="absolute bg-yellow-400 rounded-xl origin-bottom left-1/2 top-1/2"
            style={{
              width: "12px",
              height: "120px",
              transform: `translateX(-50%) translateY(-100%) rotate(${hoursDeg}deg)`,
              transformOrigin: "bottom center",
              transition: "transform 0.05s linear",
              boxShadow: "0 0 8px 2px #facc15",
              zIndex: 25,
              borderRadius: "8px",
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute bg-amber-300 rounded-lg origin-bottom left-1/2 top-1/2"
            style={{
              width: "8px",
              height: "160px",
              transform: `translateX(-50%) translateY(-100%) rotate(${minutesDeg}deg)`,
              transformOrigin: "bottom center",
              transition: "transform 0.05s linear",
              boxShadow: "0 0 10px 3px #fbbf24",
              zIndex: 20,
              borderRadius: "6px",
            }}
          />

          {/* Second hand */}
          <div
            className="absolute bg-red-500 rounded-sm origin-bottom left-1/2 top-1/2"
            style={{
              width: "4px",
              height: "180px",
              transform: `translateX(-50%) translateY(-100%) rotate(${secondsDeg}deg)`,
              transformOrigin: "bottom center",
              transition: "transform 0.05s linear",
              boxShadow: "0 0 12px 4px #ef4444",
              zIndex: 30,
              borderRadius: "4px",
            }}
          />

          {/* Clock Numbers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i + 1) * 30;
            return (
              <div
                key={i}
                className="absolute text-white font-bold select-none text-lg md:text-xl drop-shadow-lg"
                style={{
                  width: "32px",
                  height: "32px",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-25%, -45%) rotate(${
                    angle - 90
                  }deg) translate(210px) rotate(-${angle + 270}deg)`,
                  userSelect: "none",
                }}
              >
                {i + 1}
              </div>
            );
          })}

          {/* Minute ticks */}
          {[...Array(60)].map((_, i) => {
            const isHourMark = i % 5 === 0;
            return (
              <div
                key={i}
                className={`absolute rounded-full bg-yellow-300 ${
                  isHourMark ? "w-3 h-7" : "w-1 h-3"
                }`}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${
                    i * 6
                  }deg) translate(240px)`,
                  transformOrigin: "center",
                  opacity: isHourMark ? 1 : 0.6,
                  boxShadow: isHourMark ? "0 0 5px 1px #fbbf24" : "none",
                }}
              />
            );
          })}
        </div>
      </div>
      <footer className="w-full text-white text-center opacity-70">
        <div className="flex items-center justify-center gap-4">
          <Globe className="text-yellow-500" />
          Developed by Umair
        </div>
      </footer>
    </div>
  );
}
