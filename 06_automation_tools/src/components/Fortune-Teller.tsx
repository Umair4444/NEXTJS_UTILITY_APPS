"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Stars, Sparkles, Dice5, Copy, Share2, RefreshCcw } from "lucide-react";

// ---- utils: tiny seeded RNG so the same question gives a repeatable fortune ----
function hashString(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)];
}

function generateFortune(question: string) {
  const seed = hashString(
    question.trim().toLowerCase() || Math.random().toString()
  );
  const rng = mulberry32(seed);

  const vibes = [
    "audacious",
    "serendipitous",
    "cautiously optimistic",
    "plot‑twisty",
    "chaotically good",
    "legend‑in‑the‑making",
    "mysteriously delightful",
    "low‑key iconic",
  ];
  const timeframes = [
    "in three sunsets",
    "before the next coffee cools",
    "when you least refresh the page",
    "after two tiny detours",
    "this lunar cycle",
    "on a Tuesday that feels like a Friday",
  ];
  const nudges = [
    "send the message",
    "trust the weird idea",
    "say no once and yes twice",
    "clean your tabs (both kinds)",
    "touch grass, then ship",
    "ask one better question",
    "move first, finesse later",
  ];
  const twists = [
    "an unexpected ally will hype you",
    "a past lesson unlocks a shortcut",
    "the timing wants you rested, not stressed",
    "your future self already did the hard part",
    "silence will reveal the next step",
    "a small risk pays bigger than planned",
  ];
  const closers = [
    "Luck favors your keyboard.",
    "Be brave, then iterate.",
    "You are the plot twist.",
    "Vibe check: you pass.",
    "Screenshots this moment; it matters.",
  ];

  const vibe = pick(rng, vibes);
  const timeframe = pick(rng, timeframes);
  const nudge = pick(rng, nudges);
  const twist = pick(rng, twists);
  const closer = pick(rng, closers);

  const lines = [
    `Cosmic reading: ${vibe}.`,
    `Answer arrives ${timeframe}.`,
    `First move: ${nudge}.`,
    `Also, ${twist}.`,
    closer,
  ];

  // a playful rating 1–5 stars, deterministic
  //   const stars = 1 + Math.floor(mulberry32(seed ^ 0xC0SM1C)() * 5);
  // Pick a valid hex constant, e.g. 0xC0FFEE
  const stars = 1 + Math.floor(mulberry32(seed * 123456)() * 5);
  console.log(stars);

  return { lines, stars };
}

export default function FortuneTeller() {
  const [question, setQuestion] = useState("");
  const [fortune, setFortune] = useState<string[] | null>(null);
  const [stars, setStars] = useState(0);
  const [name, setName] = useState("");

  const bgUrl =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80"; // dreamy starscape

  const handleTell = () => {
    const q = question.trim() || "Surprise me";
    const { lines, stars } = generateFortune(`${name}::${q}`);
    setFortune(lines);
    setStars(stars);
  };

  const copyFortune = async () => {
    if (!fortune) return;
    const block = [
      name ? `Seeker: ${name}` : null,
      question ? `Question: ${question}` : null,
      "Fortune:",
      ...fortune,
    ]
      .filter(Boolean)
      .join("\n");
    await navigator.clipboard.writeText(block);
  };

  const shareFortune = async () => {
    if (!fortune) return;
    const text = fortune.join(" \n");
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Fortune", text });
      } else {
        await copyFortune();
        alert("Copied! Paste anywhere you like ✨");
      }
    } catch {}
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/80 backdrop-blur-[1px]" />

      <main className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/60 shadow-2xl bg-background/70 backdrop-blur-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Stars className="h-6 w-6" />
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  AI Fortune Teller
                </h1>
                <Badge variant="secondary" className="ml-auto flex gap-1">
                  <Sparkles className="h-4 w-4" /> witty mode
                </Badge>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1 space-y-2">
                    <Label htmlFor="name">Your name (optional)</Label>
                    <Input
                      id="name"
                      placeholder="Umair, Oracle, etc."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="question">Ask a question</Label>
                    <Textarea
                      id="question"
                      placeholder="Will my side project go viral?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[84px]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={handleTell} className="gap-2">
                    <Dice5 className="h-4 w-4" /> Tell my fortune
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuestion("");
                      setName("");
                    }}
                    className="gap-2"
                  >
                    <RefreshCcw className="h-4 w-4" /> Reset
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!fortune}
                    onClick={copyFortune}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" /> Copy
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!fortune}
                    onClick={shareFortune}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>

                <Separator className="my-2" />

                <AnimatePresence mode="wait">
                  {fortune ? (
                    <motion.div
                      key={fortune.join("|")}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl p-5 bg-muted/40 border border-border/50"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Sparkles
                            key={i}
                            className={`h-5 w-5 ${
                              i < stars ? "opacity-100" : "opacity-25"
                            }`}
                          />
                        ))}
                      </div>
                      <ul className="space-y-2 text-sm sm:text-base leading-relaxed">
                        {fortune.map((line, i) => (
                          <li key={i}>• {line}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.85 }}
                      className="text-sm text-muted-foreground"
                    >
                      Ask anything about love, work, launches, or life. The
                      oracle answers with a wink 😉
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-[11px] text-center mt-4 text-muted-foreground/80">
          For entertainment only. If your app goes viral, we accept credit.
        </p>
      </main>
    </div>
  );
}
