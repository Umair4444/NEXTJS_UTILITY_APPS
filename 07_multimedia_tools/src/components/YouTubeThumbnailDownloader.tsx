"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Download, Link2, Image as ImageIcon, Clipboard, Check, Loader2, Trash2 } from "lucide-react";

export default function YouTubeThumbnailDownloader() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizes = useMemo(
    () => [
      { key: "default", label: "Default (120×90)", px: "120×90" },
      { key: "mqdefault", label: "Medium (320×180)", px: "320×180" },
      { key: "hqdefault", label: "High (480×360)", px: "480×360" },
      { key: "sddefault", label: "SD (640×480)", px: "640×480" },
      { key: "maxresdefault", label: "Max (1280×720)", px: "1280×720" },
    ],
    []
  );

  const urls = useMemo(() => {
    if (!videoId) return [] as { label: string; jpg: string; webp: string; key: string; px: string }[];
    return sizes.map((s) => ({
      key: s.key,
      label: s.label,
      px: s.px,
      jpg: `https://i.ytimg.com/vi/${videoId}/${s.key}.jpg`,
      webp: `https://i.ytimg.com/vi_webp/${videoId}/${s.key}.webp`,
    }));
  }, [videoId, sizes]);

  function parseYouTubeId(text: string): string | null {
    const trimmed = text.trim();
    if (!trimmed) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

    try {
      const url = new URL(trimmed);
      const host = url.hostname.replace(/^www\./, "");

      if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
        const v = url.searchParams.get("v");
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

        const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
        if (shortsMatch) return shortsMatch[1];

        const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        if (embedMatch) return embedMatch[1];
      }

      if (host === "youtu.be") {
        const m = url.pathname.match(/\/([a-zA-Z0-9_-]{11})/);
        if (m) return m[1];
      }
    } catch {
      // not a URL
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const id = parseYouTubeId(input);
      if (!id) {
        setVideoId(null);
        setError("Please enter a valid YouTube URL or 11‑character video ID.");
        return;
      }
      setVideoId(id);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setInput(text);
    } catch {
      // ignore
    }
  }

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // ignore
    }
  }

  async function forceDownload(url: string, filename: string) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }

  function resetAll() {
    setInput("");
    setVideoId(null);
    setError(null);
  }

  return (
    <TooltipProvider>
      <section
        className="min-h-[100dvh] w-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90" />

        <div className="relative container mx-auto px-4 py-10 md:py-14">
          <div className="mx-auto max-w-3xl text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1 text-xs md:text-sm backdrop-blur-md">
              <ImageIcon className="h-4 w-4" />
              <span>YouTube Thumbnail Downloader</span>
            </div>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              Fetch a video's thumbnail in <span className="underline underline-offset-4">all sizes</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              Paste a YouTube URL (watch, youtu.be, shorts, or embed) or a raw 11‑character ID.
            </p>
          </div>

          <Card className="mx-auto max-w-3xl backdrop-blur supports-[backdrop-filter]:bg-background/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Enter YouTube URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="grid w-full gap-2">
                  <Label htmlFor="yturl">YouTube URL or ID</Label>
                  <Input
                    id="yturl"
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="flex gap-2 md:self-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="secondary" className="h-11" onClick={handlePaste}>
                        <Clipboard className="mr-2 h-4 w-4" /> Paste
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Paste from clipboard</TooltipContent>
                  </Tooltip>
                  <Button type="submit" className="h-11" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" /> Get Thumbnails
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="ghost" className="h-11" onClick={resetAll}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear
                  </Button>
                </div>
              </form>

              {error && (
                <p className="text-sm text-destructive -mt-1">{error}</p>
              )}

              <Separator />

              {videoId ? (
                <div className="space-y-6">
                  <div className="text-sm text-muted-foreground">
                    Video ID: <span className="font-mono text-foreground">{videoId}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {urls.map((u) => (
                      <Card key={u.key} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{u.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
                            <Image
                              src={u.jpg}
                              alt={`${u.label} thumbnail`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                              unoptimized
                            />
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Button type="button" size="sm" variant="secondary" onClick={() => window.open(u.jpg, "_blank")}>JPG</Button>
                            <Button type="button" size="sm" variant="secondary" onClick={() => window.open(u.webp, "_blank")}>WEBP</Button>
                            <Button type="button" size="sm" onClick={() => forceDownload(u.jpg, `${videoId}-${u.key}.jpg`)}>
                              <Download className="mr-2 h-4 w-4" /> JPG
                            </Button>
                            <Button type="button" size="sm" onClick={() => forceDownload(u.webp, `${videoId}-${u.key}.webp`)}>
                              <Download className="mr-2 h-4 w-4" /> WEBP
                            </Button>
                          </div>

                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(u.jpg, `${u.key}-jpg`)}
                            >
                              {copied === `${u.key}-jpg` ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Copied JPG URL
                                </>
                              ) : (
                                <>
                                  <Clipboard className="mr-2 h-4 w-4" /> Copy JPG URL
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(u.webp, `${u.key}-webp`)}
                            >
                              {copied === `${u.key}-webp` ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Copied WEBP URL
                                </>
                              ) : (
                                <>
                                  <Clipboard className="mr-2 h-4 w-4" /> Copy WEBP URL
                                </>
                              )}
                            </Button>
                          </div>

                          <p className="mt-3 text-xs text-muted-foreground">
                            If a size doesn't exist for a video (e.g., some older uploads lack max resolution), the link may 404.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Thumbnails will appear here after you submit a valid URL.
                </div>
              )}
            </CardContent>
          </Card>

          <footer className="mt-10 text-center text-xs text-muted-foreground">
            Built with Next.js 14 · shadcn/ui · Tailwind CSS · Background via Unsplash
          </footer>
        </div>
      </section>
    </TooltipProvider>
  );
}
