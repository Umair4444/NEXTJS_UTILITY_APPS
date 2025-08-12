"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

const WeatherCard = () => {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid city.");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to determine weather background class
  const getBackgroundClass = () => {
    if (!weather) return "bg-gradient-to-br from-sky-500 to-blue-700";
    const desc = weather.description.toLowerCase();
    if (desc.includes("sunny")) return "bg-sunny";
    if (desc.includes("cloud")) return "bg-cloudy";
    if (desc.includes("rain")) return "bg-rainy";
    if (desc.includes("snow")) return "bg-snowy";
    return "bg-default";
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-cover bg-center ${getBackgroundClass()}`}
    >
      {/* Weather background animations */}
      <div className="absolute inset-0 -z-10 opacity-60 bg-cover bg-center animate-backgroundMotion" />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/20 rounded-2xl shadow-2xl border border-white/30 w-full max-w-md mx-auto mt-20"
      >
        <Card className="bg-transparent text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Weather Control System
            </CardTitle>
            <CardDescription className="text-white/70">
              How&apos;s the weather in your city?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 mb-4"
            >
              <Input
                type="text"
                placeholder="Enter city"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
                className="bg-white/30 text-white placeholder-white/70 border-white/30"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Search"}
              </Button>
            </form>

            {error && <p className="text-red-400">{error}</p>}

            {weather && (
              <div className="grid gap-3 text-lg">
                <div className="flex items-center gap-2">
                  <ThermometerIcon className="w-6 h-6" />
                  <span>
                    {weather.temperature}°{weather.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudIcon className="w-6 h-6" />
                  <span>{weather.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6" />
                  <span>{weather.location}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WeatherCard;
