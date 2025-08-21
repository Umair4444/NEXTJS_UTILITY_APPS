"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  ListMusic,
  Waves,
} from "lucide-react";

const tracks = [
  {
    title: "Track 1",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Track 2",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Track 3",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export default function ModernAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showWave, setShowWave] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].src;
      if (isPlaying) audioRef.current.play();
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = Number(e.target.value);
      setVolume(Number(e.target.value));
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const rewind = () => {
    if (audioRef.current) audioRef.current.currentTime -= 10;
  };

  const fastForward = () => {
    if (audioRef.current) audioRef.current.currentTime += 10;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage: `url("https://source.unsplash.com/1600x900/?music,concert")`,
      }}
    >
      <Card className="w-full max-w-4xl p-6 relative overflow-hidden">
        {/* Wave background */}
        {showWave && (
          <div className="absolute inset-0 -z-10 opacity-40">
            <svg
              className="absolute bottom-0 w-full h-40 animate-wave"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#6366f1"
                fillOpacity="0.5"
                d="M0,160L48,165.3C96,171,192,181,288,165.3C384,149,480,107,576,117.3C672,128,768,192,864,213.3C960,235,1056,213,1152,208C1248,203,1344,213,1392,218.7L1440,224V0H0Z"
              ></path>
            </svg>
          </div>
        )}

        <CardContent>
          <h2 className="text-xl font-bold text-center mb-4">
            {tracks[currentTrack].title}
          </h2>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4">
            <Button onClick={prevTrack} variant="outline">
              <SkipBack />
            </Button>
            <Button onClick={rewind} variant="outline">
              <Rewind />
            </Button>
            <Button onClick={togglePlay} variant="default">
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button onClick={fastForward} variant="outline">
              <FastForward />
            </Button>
            <Button onClick={nextTrack} variant="outline">
              <SkipForward />
            </Button>
          </div>

          {/* Seek bar */}
          <div className="mt-4">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
            <div className="text-sm text-center">
              {Math.floor(currentTime)} / {Math.floor(duration)} sec
            </div>
          </div>

          {/* Volume */}
          <div className="mt-4 flex items-center gap-2">
            <Volume2 />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolume}
            />
            <span>{Math.round(volume * 100)}%</span>
          </div>

          {/* Toggle buttons */}
          <div className="mt-4 flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPlaylist(!showPlaylist)}
            >
              <ListMusic /> Playlist
            </Button>
            <Button variant="outline" onClick={() => setShowWave(!showWave)}>
              <Waves /> Wave
            </Button>
          </div>

          {/* Playlist */}
          {showPlaylist && (
            <div className="mt-6 grid gap-2">
              {tracks.map((track, index) => (
                <Card
                  key={index}
                  className={`p-3 cursor-pointer ${
                    index === currentTrack
                      ? "bg-primary text-white"
                      : "bg-muted"
                  }`}
                  onClick={() => {
                    setCurrentTrack(index);
                    setIsPlaying(true);
                    setTimeout(() => audioRef.current?.play(), 100);
                  }}
                >
                  {track.title}
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextTrack}
        />
      </Card>

      {/* Wave animation CSS */}
      <style jsx>{`
        .animate-wave {
          animation: wave 6s infinite linear;
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
