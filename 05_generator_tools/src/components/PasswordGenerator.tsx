"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, RefreshCcw, Shield } from "lucide-react";
import { BackButton } from "./BackButton";

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const CHARSETS = useMemo(() => {
    const ambiguous = "O0oIl1|`'\"{}[]()<>~";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*_-+=:;?,.";

    const filterAmbiguous = (s: string) =>
      avoidAmbiguous
        ? s
            .split("")
            .filter((c) => !ambiguous.includes(c))
            .join("")
        : s;

    return {
      lower: filterAmbiguous(lower),
      upper: filterAmbiguous(upper),
      numbers: filterAmbiguous(numbers),
      symbols: filterAmbiguous(symbols),
    };
  }, [avoidAmbiguous]);

  const pool = useMemo(() => {
    let p = "";
    if (useLower) p += CHARSETS.lower;
    if (useUpper) p += CHARSETS.upper;
    if (useNumbers) p += CHARSETS.numbers;
    if (useSymbols) p += CHARSETS.symbols;
    return p;
  }, [CHARSETS, useLower, useUpper, useNumbers, useSymbols]);

  const generate = useCallback(() => {
    if (!pool) {
      setPassword("");
      return;
    }
    let result = "";

    const cryptoObj: Crypto | undefined =
      typeof window !== "undefined" ? window.crypto : undefined;
    for (let i = 0; i < length; i++) {
      // Strong RNG if available
      if (cryptoObj?.getRandomValues) {
        const arr = new Uint32Array(1);
        cryptoObj.getRandomValues(arr);
        const idx = arr[0] % pool.length;
        result += pool[idx];
      } else {
        const idx = Math.floor(Math.random() * pool.length);
        result += pool[idx];
      }
    }
    setPassword(result);
    setCopied(false);
  }, [length, pool]);

  useEffect(() => {
    // auto-generate first time and whenever options change
    generate();
  }, [generate]);

  // Very rough entropy estimate in bits
  const entropy = useMemo(() => {
    const poolSize = pool.length || 1;
    return Math.round(length * Math.log2(poolSize));
  }, [length, pool]);

  const strength = useMemo(() => {
    // Map entropy to 0..100 scale
    const e = entropy;
    const pct = Math.max(0, Math.min(100, Math.round((e / 120) * 100)));
    let label = "Weak";
    if (pct >= 75) label = "Strong";
    else if (pct >= 45) label = "Good";
    else if (pct >= 25) label = "Fair";
    return { pct, label };
  }, [entropy]);

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main
      className="min-h-dvh w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1920&auto=format&fit=crop')",
      }}
    >
      <div className="backdrop-blur-lg bg-black/30 rounded-2xl p-1">
        <Card className="w-full max-w-2xl border-white/10 bg-white/5 text-white shadow-2xl">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="flex items-center gap-16">
                <BackButton classname="text-black" />
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6" /> Password Generator
                </div>
              </div>
            </CardTitle>
            <p className="text-white/70 text-sm">
              Generate secure passwords with customizable options.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Output */}
            <div className="space-y-2">
              <Label htmlFor="output" className="text-white">
                Password
              </Label>
              <div className="flex gap-2">
                <Input
                  id="output"
                  value={password}
                  readOnly
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="secondary"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button onClick={generate} className="shrink-0">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-white/80">
                <span>Password strength</span>
                <span>
                  {strength.label} · {entropy} bits
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${strength.pct}%`,
                    background:
                      "linear-gradient(90deg, #f87171, #fbbf24, #34d399, #60a5fa)",
                  }}
                />
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Controls */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Length</Label>
                    <span className="text-white/80 text-sm">{length}</span>
                  </div>
                  <Slider
                    value={[length]}
                    min={6}
                    max={64}
                    step={1}
                    onValueChange={(v) => setLength(v[0])}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="lower" className="text-white">
                    Lowercase (a-z)
                  </Label>
                  <Switch
                    id="lower"
                    checked={useLower}
                    onCheckedChange={setUseLower}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="upper" className="text-white">
                    Uppercase (A-Z)
                  </Label>
                  <Switch
                    id="upper"
                    checked={useUpper}
                    onCheckedChange={setUseUpper}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers" className="text-white">
                    Numbers (0-9)
                  </Label>
                  <Switch
                    id="numbers"
                    checked={useNumbers}
                    onCheckedChange={setUseNumbers}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="symbols" className="text-white">
                    Symbols (!@#…)
                  </Label>
                  <Switch
                    id="symbols"
                    checked={useSymbols}
                    onCheckedChange={setUseSymbols}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ambiguous" className="text-white">
                    Avoid ambiguous
                  </Label>
                  <Switch
                    id="ambiguous"
                    checked={avoidAmbiguous}
                    onCheckedChange={setAvoidAmbiguous}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/70">
            <span>
              Tip: Use at least 16 characters with letters, numbers, and
              symbols.
            </span>
            <span>Background photo © Unsplash</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
