"use client";

// React hooks
import React, { useState, useEffect } from "react";

// Next.js image optimization
import Image from "next/image";

// UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import to disable SSR for confetti (it requires window object)
import dynamic from "next/dynamic";

// Icons
import { FaBirthdayCake, FaGift } from "react-icons/fa";
import { GiBalloons } from "react-icons/gi";
import { BackButton } from "./BackButton";

// Confetti import (client-only)
const DynamicConfetti = dynamic(() => import("react-confetti"), { ssr: false });

// Color palette arrays
const candleColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];
const balloonColors = [...candleColors];
const confettiColors = [...candleColors, "#F7DC6F", "#BB8FCE"];

// Confetti size type
type ConfettiProps = { width: number; height: number };

export default function BirthdayWish() {
  // State hooks
  const [candlesLit, setCandlesLit] = useState(0); // Tracks number of lit candles
  const [balloonsPoppedCount, setBalloonsPoppedCount] = useState(0); // Tracks number of popped balloons
  const [showConfetti, setShowConfetti] = useState(false); // Triggers confetti
  const [windowSize, setWindowSize] = useState<ConfettiProps>({
    width: 0,
    height: 0,
  }); // Tracks viewport for confetti
  const [celebrating, setCelebrating] = useState(false); // Flags whether celebration has started

  // Total count
  const totalCandles = 5;
  const totalBalloons = 5;

  // Set window size on mount & resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trigger confetti when all candles are lit & balloons are popped
  useEffect(() => {
    if (candlesLit === totalCandles && balloonsPoppedCount === totalBalloons) {
      setShowConfetti(true);
    }
  }, [candlesLit, balloonsPoppedCount]);

  // Light one candle at a time
  const lightCandle = (index: number) => {
    if (index === candlesLit) setCandlesLit((prev) => prev + 1);
  };

  // Pop one balloon at a time
  const popBalloon = (index: number) => {
    if (index === balloonsPoppedCount)
      setBalloonsPoppedCount((prev) => prev + 1);
  };

  // Celebration logic with animation delay
  const celebrate = () => {
    setCelebrating(true);
    setShowConfetti(true);
    const interval = setInterval(() => {
      setCandlesLit((prev) => {
        if (prev < totalCandles) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500); // Light candles one by one every 0.5s
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background image using Next.js Image */}
      <Image
        src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlydGhkYXl8ZW58MHx8MHx8fDA%3D"
        alt="Birthday background"
        fill
        className="object-cover z-0 opacity-90"
        priority
      />

      {/* Back Button fixed at top-left */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton classname="bg-white/80 text-black shadow-md hover:bg-white" />
      </div>

      {/* Foreground animated content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card wrapper with glass effect */}
        <Card className="bg-white/30 backdrop-blur-md text-black border-white/30 shadow-2xl">
          {/* Card Header */}
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">
              Happy Birthday!
            </CardTitle>
            <CardDescription className="text-2xl text-gray-800">
              Umair Ali Khan
            </CardDescription>
            <p className="text-lg text-gray-700">May 1st</p>
          </CardHeader>

          {/* Card Content - Candles & Balloons */}
          <CardContent className="space-y-6 text-center">
            {/* Candles Section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Light the candles:
              </h3>
              <div className="flex justify-center space-x-2">
                {/* Render each candle icon */}
                {[...Array(totalCandles)].map((_, index) => (
                  <AnimatePresence key={index}>
                    {(celebrating && index <= candlesLit) ||
                    (!celebrating && index < candlesLit) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: celebrating ? index * 0.5 : 0,
                        }}
                      >
                        {/* Lit candle */}
                        <FaBirthdayCake
                          className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                          style={{
                            color: candleColors[index % candleColors.length],
                          }}
                          onClick={() => lightCandle(index)}
                        />
                      </motion.div>
                    ) : (
                      // Unlit candle
                      <FaBirthdayCake
                        className="w-8 h-8 text-gray-300 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => lightCandle(index)}
                      />
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>

            {/* Balloons Section */}
            <div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Pop the balloons:
              </h3>
              <div className="flex justify-center space-x-2">
                {/* Render each balloon icon */}
                {[...Array(totalBalloons)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GiBalloons
                      className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        color:
                          index < balloonsPoppedCount
                            ? "#D1D5DB"
                            : balloonColors[index % balloonColors.length],
                      }}
                      onClick={() => popBalloon(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Celebrate button */}
          <CardFooter className="flex justify-center">
            <Button
              className="bg-black text-white hover:bg-gray-800 transition"
              onClick={celebrate}
              disabled={celebrating}
            >
              Celebrate! <FaGift className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Confetti shown when celebration is complete */}
      {showConfetti && (
        <DynamicConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={confettiColors}
        />
      )}
    </div>
  );
}
