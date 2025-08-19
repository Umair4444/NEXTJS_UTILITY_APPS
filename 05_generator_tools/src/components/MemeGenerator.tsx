"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import * as htmlToImage from "html-to-image";
import { saveAs } from "file-saver";
import { BackButton } from "./BackButton";

export default function MemeGenerator() {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // text states
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [topFontSize, setTopFontSize] = useState(40);
  const [bottomFontSize, setBottomFontSize] = useState(40);
  const [textColor, setTextColor] = useState("#ffffff");

  // background source
  const [bgSource, setBgSource] = useState<"imgflip" | "gimme" | "upload">(
    "imgflip"
  );
  const [uploaded, setUploaded] = useState<string | null>(null);

  // meme list + selection
  const [imgflipMemes, setImgflipMemes] = useState<any[]>([]);
  const [gimmeMemes, setGimmeMemes] = useState<any[]>([]);
  const [randomMeme, setRandomMeme] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  // image fit
  const [fitMode, setFitMode] = useState<"cover" | "contain">("contain");

  // fetch memes from imgflip
  useEffect(() => {
    const fetchImgflip = async () => {
      try {
        const response = await fetch(
          `https://api.imgflip.com/get_memes?${Date.now()}`
        );
        const data = await response.json();
        if (data.success) {
          setImgflipMemes(
            data.data.memes.map((m: any) => ({
              url: m.url,
              name: m.name,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching imgflip memes", err);
      }
    };
    fetchImgflip();
  }, []);

  // fetch memes from gimme
  useEffect(() => {
    const fetchGimme = async () => {
      try {
        const response = await fetch("https://meme-api.com/gimme/10");
        const data = await response.json();

        if (data.memes) {
          setGimmeMemes(
            data.memes.map((m: any) => ({
              url: m.url,
              name: m.title,
            }))
          );
        } else if (data.url) {
          setGimmeMemes([{ url: data.url, name: data.title }]);
        }
      } catch (err) {
        console.error("Error fetching gimme memes", err);
      }
    };
    fetchGimme();
  }, []);

  // pick random meme
  const randomMemeGenerator = useCallback(() => {
    let source: any[] = [];
    if (bgSource === "imgflip") source = imgflipMemes;
    if (bgSource === "gimme") source = gimmeMemes;

    if (source.length > 0) {
      const random = source[Math.floor(Math.random() * source.length)];
      setRandomMeme(`${random.url}?t=${Date.now()}`);
    } else {
      setRandomMeme(`/loading.jpg?t=${Date.now()}`);
    }
  }, [bgSource, imgflipMemes, gimmeMemes]);

  // update bgImage based on source
  useEffect(() => {
    if (bgSource === "imgflip" || bgSource === "gimme") {
      setBgImage(randomMeme || `/loading.jpg?t=${Date.now()}`);
    } else if (bgSource === "upload" && uploaded) {
      setBgImage(uploaded);
    } else {
      setBgImage(`/loading.jpg?t=${Date.now()}`);
    }
  }, [bgSource, randomMeme, uploaded]);

  useEffect(() => {
    randomMemeGenerator();
  }, [randomMemeGenerator]);

  // download
  async function downloadMeme() {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(canvasRef.current, {
        cacheBust: true,
      });
      saveAs(dataUrl, "meme.jpg");
    } catch (err) {
      console.error(err);
    }
  }

  // upload
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploaded(url);
    setBgSource("upload");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-900 p-6 flex flex-col lg:flex-row items-start justify-center gap-6">
      <Card className="w-full lg:w-1/3 p-4 bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Meme Controls</h2>
          <BackButton />
        </div>

        {/* Background sources */}
        <label className="block text-sm mb-1 text-white">Background</label>
        <div className="flex flex-wrap gap-2 mb-3">
          <Button
            variant={bgSource === "imgflip" ? "default" : "outline"}
            onClick={() => {
              setBgSource("imgflip");
              randomMemeGenerator();
            }}
          >
            Imgflip Memes
          </Button>
          <Button
            variant={bgSource === "gimme" ? "default" : "outline"}
            onClick={() => {
              setBgSource("gimme");
              randomMemeGenerator();
            }}
          >
            Gimme Memes
          </Button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-3 w-full text-white"
        />

        {/* Top text controls */}
        <label className="block text-sm mb-1 text-white">Top text</label>
        <Input
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          className="mb-2 text-white"
        />

        <label className="block text-sm mb-1 text-white">
          Top font size: {topFontSize}px
        </label>
        <Slider
          value={[topFontSize]}
          onValueChange={(v: number[]) => setTopFontSize(v[0])}
          className="mb-3"
        />

        {/* Bottom text controls */}
        <label className="block text-sm mb-1 text-white">Bottom text</label>
        <Input
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          className="mb-2 text-white"
        />

        <label className="block text-sm mb-1 text-white">
          Bottom font size: {bottomFontSize}px
        </label>
        <Slider
          value={[bottomFontSize]}
          onValueChange={(v: number[]) => setBottomFontSize(v[0])}
          className="mb-3"
        />

        {/* Shared settings */}
        <label className="block text-sm mb-1 text-white">Text color</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="mb-3 h-10 w-16 p-0"
        />

        {/* Fit mode */}
        <label className="block text-sm mb-1 text-white">Image Fit</label>
        <div className="flex gap-2 mb-3">
          <Button
            variant={fitMode === "cover" ? "default" : "outline"}
            onClick={() => setFitMode("cover")}
          >
            Cover
          </Button>
          <Button
            variant={fitMode === "contain" ? "default" : "outline"}
            onClick={() => setFitMode("contain")}
          >
            Contain
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button className="py-3 px-5 w-40" onClick={downloadMeme}>
            Download PNG
          </Button>
          <Button
            className="py-3 px-5 w-20"
            variant="destructive"
            onClick={() => {
              setTopText("TOP TEXT");
              setBottomText("BOTTOM TEXT");
              setTopFontSize(40);
              setBottomFontSize(40);
              setTextColor("#ffffff");
              setBgSource("imgflip");
              setUploaded(null);
              setFitMode("contain");
            }}
          >
            Reset
          </Button>
          <Button className="py-3 px-5 w-40" onClick={randomMemeGenerator}>
            New Meme
          </Button>
        </div>
      </Card>

      {/* Preview */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl font-semibold mb-3 text-white">Preview</h2>
        <div
          ref={canvasRef}
          className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black aspect-[16/9]"
        >
          {bgImage && (
            <Image
              src={bgImage}
              alt="meme background"
              fill
              className={`${
                fitMode === "cover" ? "object-cover" : "object-contain"
              } bg-black`}
            />
          )}

          {/* Top text */}
          <div className="absolute left-1/2 top-4 transform -translate-x-1/2 text-center">
            <div
              style={{
                fontSize: `${topFontSize}px`,
                color: textColor,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                textShadow: "0 2px 0 rgba(0,0,0,0.8)",
                WebkitTextStroke: "2px rgba(0,0,0,0.8)",
              }}
            >
              {topText}
            </div>
          </div>

          {/* Bottom text */}
          <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 text-center">
            <div
              style={{
                fontSize: `${bottomFontSize}px`,
                color: textColor,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
                textShadow: "0 2px 0 rgba(0,0,0,0.8)",
              }}
            >
              {bottomText}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
