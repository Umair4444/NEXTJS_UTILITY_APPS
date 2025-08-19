"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/BackButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Copy,
  Volume2,
  Share2,
  RefreshCw,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import { JOKES } from "@/lib/jokesData";

const BG_URL =
  "https://images.unsplash.com/photo-1601513445637-997d743ac760?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvd258ZW58MHx8MHx8fDA%3D";
export default function JokeGenerator() {
  const [category, setCategory] = useState<string>("programming");
  const [maxLength, setMaxLength] = useState<string>("any");
  const [joke, setJoke] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [tts, setTts] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  const pool = useMemo(() => JOKES[category] || [], [category]);

  const filteredPool = useMemo(() => {
    let list = pool;
    // console.log("pool",pool)
    if (maxLength !== "any") {
      const limit = maxLength === "short" ? 60 : 120;
      list = list.filter((j) => j.length <= limit);
      // console.log("filter list", list);
    }
    // console.log("max length", maxLength)
    if (filter.trim()) {
      const f = filter.toLowerCase();
      list = list.filter((j) => j.toLowerCase().includes(f));
    }
    // console.log(list.length)
    // console.log(list)
    return list.length ? list : pool; // fall back if filtering removes all
  }, [pool, maxLength, filter]);

  // console.log("filteredPool", filteredPool.length);
  const generate = useCallback(() => {
    if (!filteredPool.length) return;
    const idx = Math.floor(Math.random() * filteredPool.length);
    const next = filteredPool[idx];
    // console.log("id", idx);
    // console.log("next", next);
    setJoke(next);
    setHistory((h) => [next, ...h].slice(0, 6));
  }, [filteredPool]);

  // Generate a first joke on load
  useEffect(() => {
    if (!joke) generate();
  }, [category, maxLength]);

  const speak = useCallback(() => {
    if (!tts || !joke)
      // toast if no jokes to listen
      return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(joke);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
      // toast joke started
      // console.log("tts", tts);
    }
  }, [joke, tts]);

  const copy = useCallback(async () => {
    if (!joke) return;
    try {
      await navigator.clipboard.writeText(joke);
      // toast for copy
    } catch {}
    // toast for copy failed
  }, [joke]);

  const share = useCallback(async () => {
    if (!joke) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "A quick joke", text: joke });
        // toast for sharing
      } catch {}
    } else {
      copy();
      // toast for sharing failed joke copied to your clipboard Please try another way!
    }
  }, [joke, copy]);

  if (!joke) return;
  // toast for No Jokes right now please click on generate

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden"
      style={{
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Joke Generator
          </h1>
          <p className="mt-2 text-white/80">
            Fresh chuckles on demand—pick a vibe and hit generate.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-2 items-center">
                    <Sparkles size={20} /> Options
                  </div>
                  <BackButton classname="text-black" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-white/90">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white/10 text-white placeholder:text-white/70">
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="dad">Dad Jokes</SelectItem>
                    <SelectItem value="pun">Puns</SelectItem>
                    <SelectItem value="knock">Knock-knock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Max length</Label>
                <Select value={maxLength} onValueChange={setMaxLength}>
                  <SelectTrigger className="bg-white/10 text-white">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white/90">Keyword filter</Label>
                <Input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="e.g., database, bee, photo"
                  className="bg-white/10 text-white placeholder:text-white/60"
                />
              </div>

              <div className="flex items-end md:items-center ">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2">
                  <Label className="text-white/90">Voice</Label>
                  <Switch checked={tts} onCheckedChange={setTts} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Your joke</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={joke}
                readOnly
                // onChange={(e)=>setJoke(e.target.value)}
                className="min-h-[120px] resize-none bg-white/10 text-white placeholder:text-white/70"
                placeholder="Click Generate to get a joke!"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={generate} className="gap-2">
                  <RefreshCw size={16} /> Generate
                </Button>
                <Button variant="secondary" onClick={copy} className="gap-2">
                  <Copy size={16} /> Copy
                </Button>
                <Button
                  variant="secondary"
                  onClick={speak}
                  className="gap-2"
                  disabled={!tts}
                >
                  <Volume2 size={16} /> Speak
                </Button>
                <Button variant="secondary" onClick={share} className="gap-2">
                  <Share2 size={16} /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <History size={18} /> Recent
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-white/80">No jokes yet—generate a few!</p>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2">
                  {history.map((h, i) => (
                    <li
                      key={i}
                      className="rounded-xl bg-black/30 p-3 text-white/90"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <footer className="text-center text-xs text-white/70">
          Developed By Umair
        </footer>
      </main>
    </div>
  );
}
