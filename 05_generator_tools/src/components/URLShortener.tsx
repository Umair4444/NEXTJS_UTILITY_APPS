"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ original: string; short: string }[]>(
    []
  );

  const shortenUrl = async () => {
    if (!url || !/^https?:\/\//.test(url)) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.tinyurl.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TINYURL_TOKEN}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Error shortening URL");

      const data = await res.json();
      const short = data.data?.tiny_url || null;
      if (short) {
        setShortUrl(short);
        setHistory((prev) => [{ original: url, short }, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      alert("Copied to clipboard ✅");
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      <Card
        className="w-full max-w-lg relative overflow-hidden rounded-2xl border border-white/20 
        bg-transparent/40 backdrop-blur-xl shadow-2xl"
      >
        {/* gradient border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-transparent opacity-40" />

        <CardHeader className="relative z-10">
          <CardTitle className="text-center text-2xl font-bold text-white drop-shadow-md">
            <div className="flex items-center gap-10">
              <BackButton classname="text-black" />
              🔗 URL Shortener
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4 text-white">
          <Input
            placeholder="Enter your URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-white/20 text-white placeholder:text-gray-300"
          />

          <Button
            onClick={shortenUrl}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            disabled={loading || !url}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              "Shorten URL"
            )}
          </Button>

          {shortUrl && (
            <div className="p-3 rounded-lg border border-white/30 bg-white/10 backdrop-blur-md text-center">
              <p className="text-sm text-gray-200">Your short link:</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 underline hover:text-blue-400 transition"
                >
                  {shortUrl}
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 bg-white/20 text-white hover:bg-white/30"
                >
                  <Copy className="w-4 h-4" /> Copy
                </Button>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-white/90">History</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto text-sm">
                {history.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col border border-white/20 rounded-md p-2 
                    bg-white/10 backdrop-blur-md"
                  >
                    <span className="truncate text-gray-200">
                      Original:{" "}
                      <a
                        href={item.original}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-200 underline hover:text-blue-400"
                      >
                        {item.original}
                      </a>
                    </span>
                    <span>
                      Short:{" "}
                      <a
                        href={item.short}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-200 underline hover:text-green-400"
                      >
                        {item.short}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
