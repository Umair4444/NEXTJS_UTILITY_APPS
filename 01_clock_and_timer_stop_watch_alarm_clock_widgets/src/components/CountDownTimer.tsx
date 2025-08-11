"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import GoBack from "./GoBack"; // Import your Go Back component

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const handleSetDuration = (): void => {
    const parsed = Number(duration);
    if (!isNaN(parsed) && parsed > 0) {
      setTimeLeft(parsed);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(
      typeof duration === "number" ? duration : Number(duration) || 0
    );
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;

            // Set time to 0 first, then show toast
            setTimeout(() => {
              toast({
                title: "⏰ Time's up!",
                description: "Your countdown has finished.",
                variant: "destructive",
                className: "bg-red-600 text-white border-none rounded-xl",
              });
            }, 50);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, isPaused, toast]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <Image
        src="/timer.jpg"
        alt="Background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Go Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <GoBack />
      </div>

      {/* Countdown card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">
          ⏳ Countdown Timer
        </h1>

        <div className="flex items-center mb-6">
          <Input
            type="number"
            placeholder="Enter seconds"
            min={1}
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md bg-white/20 text-white border-white/30 placeholder-white focus:ring-2 focus:ring-cyan-300 appearance-none [moz-appearance:textfield]"
          />
          <Button
            onClick={handleSetDuration}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:scale-105 transition-transform"
          >
            Set
          </Button>
        </div>

        <div className="text-6xl font-bold mb-8 text-center tracking-widest transition-all duration-500">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            onClick={handleStart}
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white hover:scale-105 transition-transform"
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            onClick={handlePause}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105 transition-transform"
          >
            Pause
          </Button>
          <Button
            onClick={handleReset}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white hover:scale-105 transition-transform"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
