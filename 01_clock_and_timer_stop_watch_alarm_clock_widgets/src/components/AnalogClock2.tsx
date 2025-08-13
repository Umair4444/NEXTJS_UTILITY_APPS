"use client";

import React, { useEffect, useState } from "react";
import GoBack from "./GoBack";

const AnalogClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //   const seconds = 0;
  //   const minutes = 40;
  //   const hours = 0;
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = seconds * 6; // 360 / 60
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-8 tracking-wide drop-shadow-xl">
        Elegant Analog Clock
      </h1>

      <div className="relative flex">
        <div className="absolute top-0 -left-20">
          <GoBack />
        </div>

        {/* Clock face with high-contrast border */}
        <div className="relative w-72 h-72 rounded-full border-4 border-white/40 bg-black/40 backdrop-blur-md shadow-lg">
          {/* Hour Hand */}
          <div
            className="absolute w-1.5 h-20 bg-white origin-bottom left-1/2 bottom-1/2 rounded-b shadow-sm"
            style={{
              transform: `rotate(${hourDeg}deg) translateX(-50%) translateY(5%)`,
            }}
          />

          {/* Minute Hand */}
          <div
            className="absolute w-1 h-28 bg-yellow-300 origin-bottom left-1/2 bottom-1/2 shadow-sm"
            style={{
              transform: `rotate(${minuteDeg}deg) translateX(50%) translateY(5%)`,
            }}
          />

          {/* Second Hand */}
          <div
            className="absolute w-0.5 h-32 bg-red-500 origin-bottom left-1/2 bottom-1/2"
            style={{
              transform: `rotate(${secondDeg}deg) translateX(50%) translateY(5%)`,
            }}
          />

          {/* Center Circle */}
          <div className="absolute w-4 h-4 bg-white rounded-full border border-black left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <footer className="py-2 text-white text-lg">Developed by Umair</footer>
    </div>
  );
};

export default AnalogClock;
