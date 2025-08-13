"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type LapTime = number;

export default function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const lapsEndRef = useRef<HTMLDivElement | null>(null); // Ref for scroll

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Scroll to last lap when lapTimes changes
  useEffect(() => {
    if (lapsEndRef.current) {
      lapsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lapTimes]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
  };
  const handleLap = () => setLapTimes((prev) => [...prev, time]);

  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1714176961136-4edcb1e8b154?w=600&auto=format&fit=crop&q=60')",
      }}
    >
      <Card className="w-full max-w-lg bg-black/60 text-white border border-white/20 backdrop-blur-lg shadow-2xl">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-5xl font-extrabold text-neon-green">
            Stopwatch
          </CardTitle>
          <CardDescription className="text-lg text-gray-300">
            Track your performance with precision.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 p-6">
          <div className="text-7xl sm:text-8xl font-mono font-bold text-neon-green">
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}.
            {milliseconds.toString().padStart(2, "0")}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={isRunning ? handleStop : handleStart}
              className={`px-6 py-2 text-lg font-medium rounded-lg ${
                isRunning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isRunning ? "Stop" : "Start"}
            </Button>
            <Button
              onClick={handleReset}
              className="px-6 py-2 text-lg font-medium rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Reset
            </Button>
            <Button
              onClick={handleLap}
              disabled={time === 0}
              className={`px-6 py-2 text-lg font-medium rounded-lg border border-white/50 text-white hover:bg-white/10 ${
                time === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Lap
            </Button>
          </div>

          <div className="w-full max-w-md">
            <Card className="overflow-hidden bg-white/10 border border-white/20 text-white backdrop-blur-sm">
              <CardHeader className="py-2 h-16 text-center">
                <CardTitle className="text-xl font-semibold text-neon-green">
                  Lap Times
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] overflow-auto p-0 scrollbar-hide">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left text-white">Lap</TableHead>
                      <TableHead className="text-right text-white">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lapTimes.map((lapTime, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-white/10 transition"
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-right">
                          {Math.floor(lapTime / 60000)
                            .toString()
                            .padStart(2, "0")}
                          :
                          {Math.floor((lapTime % 60000) / 1000)
                            .toString()
                            .padStart(2, "0")}
                          .
                          {Math.floor((lapTime % 1000) / 10)
                            .toString()
                            .padStart(2, "0")}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Invisible div to scroll into view */}
                    <div ref={lapsEndRef} />
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
