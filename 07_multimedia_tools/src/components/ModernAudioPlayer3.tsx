"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  ListMusic,
} from "lucide-react";

const playlist = [
  {
    title: "Lofi Chill",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Relax Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Focus Vibes",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    title: "Night Walk",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    title: "Dilan Teer Bija",
    src: "https://koyal.pk/track/dilan-teer-bija-105857",
  },
];

export default function ModernAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrack].src;
      audioRef.current.load();
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleFastForward = () => {
    if (audioRef.current) audioRef.current.currentTime += 10;
  };
  const handleRewind = () => {
    if (audioRef.current) audioRef.current.currentTime -= 10;
  };
  const handleVolume = (val: number[]) => {
    setVolume(val[0]);
    if (audioRef.current) audioRef.current.volume = val[0];
  };
  const handleSeek = (val: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = val[0];
      setProgress(val[0]);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?&auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Player */}
        <Card className="relative w-[480px]  bg-black/70 text-white rounded-2xl shadow-xl">
          {/* Equalizer Background */}
          {/* {isPlaying && (
            <div className="absolute bottom-0 left-0 w-full flex justify-center items-end gap-2 z-30 h-32">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="bg-cyan-400 w-3 rounded animate-equalizer"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          )} */}

          <CardContent className="p-6 flex flex-col items-center space-y-4">
            {/* Title & Playlist Button */}
            <div className="flex justify-between w-full items-center">
              <div className="overflow-hidden w-40">
                <span className="animate-marquee whitespace-nowrap text-lg font-semibold">
                  {playlist[currentTrack].title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPlaylist(!showPlaylist)}
              >
                <ListMusic className="h-6 w-6" />
              </Button>
            </div>

            {/* Seek Bar */}
            <div className="w-full flex flex-col">
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                min={0}
                max={duration || 0}
                step={1}
              />
              <div className="flex justify-between text-sm mt-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={handlePrev}>
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRewind}>
                <Rewind className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-white text-black rounded-full h-12 w-12"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleFastForward}>
                <FastForward className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>

            {/*  Animation */}
            {isPlaying && (
              <div className="equalizer-container">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="equalizer-bar"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}

            {/* Volume */}
            <div className="flex items-center space-x-3 w-full">
              {volume > 0 ? <Volume2 /> : <VolumeX />}
              <Slider
                value={[volume]}
                onValueChange={handleVolume}
                min={0}
                max={1}
                step={0.01}
                className="flex-1"
              />
              <span className="text-sm">{Math.round(volume * 100)}%</span>
            </div>

            <audio ref={audioRef} />
          </CardContent>
        </Card>

        {/* Playlist Sidebar */}
        {showPlaylist && (
          <Card className="w-[480px] md:[300px] bg-black/70 text-white rounded-2xl shadow-xl">
            <CardContent className="p-4 space-y-2 overflow-y-auto max-h-[400px]">
              <h3 className="text-md font-semibold mb-2">Playlist</h3>
              {[...playlist].map((track, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg cursor-pointer hover:bg-white/20 ${
                    index % playlist.length === currentTrack
                      ? "bg-white/30"
                      : ""
                  }`}
                  onClick={() => setCurrentTrack(index % playlist.length)}
                >
                  {track.title}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
