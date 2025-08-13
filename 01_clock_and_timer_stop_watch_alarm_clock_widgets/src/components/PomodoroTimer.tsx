"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import GoBack from "./GoBack";

type TimerStatus = "idle" | "running" | "paused";
type SessionType = "work" | "break";

interface PomodoroState {
  workDuration: number;
  breakDuration: number;
  currentTime: number;
  currentSession: SessionType;
  timerStatus: TimerStatus;
}

export default function PomodoroTimer() {
  const [state, setState] = useState<PomodoroState>({
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    currentTime: 25 * 60,
    currentSession: "work",
    timerStatus: "idle",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.timerStatus === "running" && state.currentTime > 0) {
      timerRef.current = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          currentTime: prevState.currentTime - 1,
        }));
      }, 1000);
    } else if (state.currentTime === 0) {
      clearInterval(timerRef.current as NodeJS.Timeout);
      handleSessionSwitch();
    }
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [state.timerStatus, state.currentTime]);

  const handleSessionSwitch = () => {
    setState((prevState) => {
      const isWorkSession = prevState.currentSession === "work";
      return {
        ...prevState,
        currentSession: isWorkSession ? "break" : "work",
        currentTime: isWorkSession
          ? prevState.breakDuration
          : prevState.workDuration,
      };
    });
  };

  const handleStartPause = () => {
    if (state.timerStatus === "running") {
      setState((prevState) => ({ ...prevState, timerStatus: "paused" }));
      clearInterval(timerRef.current as NodeJS.Timeout);
    } else {
      setState((prevState) => ({ ...prevState, timerStatus: "running" }));
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setState((prevState) => ({
      ...prevState,
      currentTime: prevState.workDuration,
      currentSession: "work",
      timerStatus: "idle",
    }));
  };

  const handleDurationChange = (type: SessionType, increment: boolean) => {
    setState((prevState) => {
      const durationChange = increment ? 60 : -60;
      if (type === "work") {
        return {
          ...prevState,
          workDuration: Math.max(60, prevState.workDuration + durationChange),
          currentTime:
            prevState.currentSession === "work"
              ? Math.max(60, prevState.workDuration + durationChange)
              : prevState.currentTime,
        };
      } else {
        return {
          ...prevState,
          breakDuration: Math.max(60, prevState.breakDuration + durationChange),
          currentTime:
            prevState.currentSession === "break"
              ? Math.max(60, prevState.breakDuration + durationChange)
              : prevState.currentTime,
        };
      }
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="absolute top-6 left-6">
        <GoBack />
      </div>

      {/* Timer Card */}
      <Card className="relative z-10 w-full max-w-md p-6 bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl border border-white/20 text-white">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold drop-shadow-lg">Pomodoro Timer</h1>
          <p className="opacity-90 drop-shadow-md">
            Boost focus with the Pomodoro Technique
          </p>

          {/* Session Info */}
          <div className="text-2xl font-medium">
            {state.currentSession === "work" ? "Work" : "Break"}
          </div>

          {/* Timer */}
          <div className="text-8xl font-bold drop-shadow-lg">
            {formatTime(state.currentTime)}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", false)}
            >
              <MinusIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDurationChange("work", true)}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleStartPause}>
              {state.timerStatus === "running" ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RefreshCwIcon className="h-6 w-6" />
            </Button>
          </div>

          {/* Info Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">What is Pomodoro Technique?</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg bg-white text-black rounded-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ➡️ Explanation of Pomodoro Technique 🔥
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The Pomodoro Technique is a time management method that uses a
                  timer to break work into intervals, traditionally 25 minutes
                  in length, separated by short breaks.
                  <br />
                  <br />
                  <strong>Steps:</strong>
                  <ol className="list-decimal list-inside">
                    <li>Select a single task to focus on.</li>
                    <li>Set a timer for 25 min. and work until it rings.</li>
                    <li>Take a 5 min. break.</li>
                    <li>Repeat for 4 rounds, then take a longer break.</li>
                  </ol>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction>
                  <a
                    href="https://todoist.com/productivity-methods/pomodoro-technique"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
