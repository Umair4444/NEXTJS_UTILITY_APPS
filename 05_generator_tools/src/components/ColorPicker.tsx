"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Filter } from "lucide-react";

export default function ColorPicker() {
  const [color, setColor] = useState("#3498db");
  const [picking, setPicking] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
  };

  const pickFromScreen = async () => {
    if ("EyeDropper" in window) {
      // @ts-ignore - EyeDropper is experimental
      const eyeDropper = new EyeDropper();
      try {
        setPicking(true); // show "Selecting..."
        const result = await eyeDropper.open();
        setColor(result.sRGBHex); // result like "#RRGGBB"
      } catch (err) {
        console.error("EyeDropper canceled", err);
      } finally {
        setPicking(false); // back to normal
      }
    } else {
      alert("Your browser does not support the EyeDropper API.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">🎨 Color Picker</h1>
        <CardContent className="flex flex-col items-center gap-4">
          {/* Native color input */}
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-32 h-16 cursor-pointer rounded-md border-2"
          />

          {/* Preview */}
          <div
            className="w-40 h-40 rounded-xl shadow-md border"
            style={{ backgroundColor: color }}
          ></div>

          {/* Hex Code + Copy Button */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg">{color}</span>
            <Button size="sm" onClick={copyToClipboard} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          {/* Eyedropper Button */}
          <Button size="sm" onClick={pickFromScreen} disabled={picking}>
            <Filter className="w-4 h-4 mr-2" />
            {picking ? "Selecting..." : "Pick from Screen"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
