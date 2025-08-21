"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (value[0] / 100) * audio.duration;
      setProgress(value[0]);
    }
  };

  const handleVolume = (value: number[]) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = value[0] / 100;
      setVolume(value[0] / 100);
    }
  };

  return (
    <main
      className="h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="bg-black/60 text-white rounded-2xl p-6 shadow-lg w-[400px]">
        <h1 className="text-xl font-bold mb-4 text-center">
          🎶 Simple Audio Player
        </h1>

        <audio
          ref={audioRef}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Progress bar */}
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={handleSeek}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          {/* Play/Pause */}
          <Button onClick={togglePlay} variant="secondary" size="icon">
            {isPlaying ? <Pause /> : <Play />}
          </Button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 size={20} />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolume}
              className="w-28"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
