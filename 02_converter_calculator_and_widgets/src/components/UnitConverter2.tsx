"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ConverterKind = "currency" | "length" | "weight" | "temperature";

type CurrencyRates = {
  base: string;
  rates: Record<string, number>;
  date?: string;
};

// Conversion factors
const LENGTH_UNITS = [
  { unit: "m", factor: 1 },
  { unit: "km", factor: 1000 },
  { unit: "cm", factor: 0.01 },
  { unit: "mm", factor: 0.001 },
  { unit: "mi", factor: 1609.344 },
  { unit: "yd", factor: 0.9144 },
  { unit: "ft", factor: 0.3048 },
  { unit: "in", factor: 0.0254 },
];
const WEIGHT_UNITS = [
  { unit: "kg", factor: 1 },
  { unit: "g", factor: 0.001 },
  { unit: "lb", factor: 0.45359237 },
  { unit: "oz", factor: 0.028349523125 },
];
const TEMP_UNITS = ["C", "F", "K"] as const;
const COMMON_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "PKR",
  "INR",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
  "AED",
];

// Utility
function convertByFactor(
  value: number,
  fromUnit: string,
  toUnit: string,
  units: { unit: string; factor: number }[]
) {
  const from = units.find((u) => u.unit === fromUnit)?.factor;
  const to = units.find((u) => u.unit === toUnit)?.factor;
  if (!from || !to) return NaN;
  return (value * from) / to;
}
function convertTemperature(
  value: number,
  from: (typeof TEMP_UNITS)[number],
  to: (typeof TEMP_UNITS)[number]
) {
  let kelvin: number;
  switch (from) {
    case "C":
      kelvin = value + 273.15;
      break;
    case "F":
      kelvin = ((value - 32) * 5) / 9 + 273.15;
      break;
    case "K":
      kelvin = value;
      break;
  }
  switch (to) {
    case "C":
      return kelvin - 273.15;
    case "F":
      return ((kelvin - 273.15) * 9) / 5 + 32;
    case "K":
      return kelvin;
  }
}

export default function UnitConverter() {
  const router = useRouter();
  const [kind, setKind] = useState<ConverterKind>("currency");
  const [amount, setAmount] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>("USD");
  const [toUnit, setToUnit] = useState<string>("PKR");
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (kind !== "currency") return;

    let ignore = false;
    async function loadRates() {
      try {
        setLoadingRates(true);
        setApiError(null);
        const res = await fetch(
          `https://api.exchangerate-api.com/v4/latest/USD`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch exchange rates");
        const data = await res.json();
        if (!ignore)
          setRates({ base: data.base, rates: data.rates, date: data.date });
      } catch (e: any) {
        if (!ignore) setApiError(e?.message ?? "Unknown error");
      } finally {
        if (!ignore) setLoadingRates(false);
      }
    }
    loadRates();
    return () => {
      ignore = true;
    };
  }, [kind]);

  useEffect(() => {
    switch (kind) {
      case "currency":
        setFromUnit("USD");
        setToUnit("PKR");
        break;
      case "length":
        setFromUnit("m");
        setToUnit("ft");
        break;
      case "weight":
        setFromUnit("kg");
        setToUnit("lb");
        break;
      case "temperature":
        setFromUnit("C");
        setToUnit("F");
        break;
    }
  }, [kind]);

  const result = useMemo(() => {
    if (Number.isNaN(amount)) return "";
    if (kind === "currency") {
      if (!rates || !rates.rates) return "";
      const fromRate = fromUnit === rates.base ? 1 : rates.rates[fromUnit];
      const toRate = toUnit === rates.base ? 1 : rates.rates[toUnit];
      if (!fromRate || !toRate) return "";
      return (amount / fromRate) * toRate;
    }
    if (kind === "length")
      return convertByFactor(amount, fromUnit, toUnit, LENGTH_UNITS);
    if (kind === "weight")
      return convertByFactor(amount, fromUnit, toUnit, WEIGHT_UNITS);
    if (kind === "temperature")
      return convertTemperature(amount as any, fromUnit as any, toUnit as any);
    return "";
  }, [amount, fromUnit, toUnit, kind, rates]);

  const formatted = useMemo(() => {
    if (result === "" || result == null || Number.isNaN(result as any))
      return "";
    try {
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 6,
      }).format(result as number);
    } catch {
      return String(result);
    }
  }, [result]);

  const unitOptions = useMemo(() => {
    switch (kind) {
      case "currency":
        return COMMON_CURRENCIES;
      case "length":
        return LENGTH_UNITS.map((u) => u.unit);
      case "weight":
        return WEIGHT_UNITS.map((u) => u.unit);
      case "temperature":
        return [...TEMP_UNITS];
    }
  }, [kind]);

  return (
    // <div
    //   className="min-h-screen w-full bg-cover bg-center relative"
    //   style={{ backgroundImage: "url(https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0)" }}
    // >
    <div className="min-h-screen w-full relative">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
        alt="Background"
        fill
        className="object-cover object-center z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:py-20">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => router.back()}
        >
          Back
        </Button>

        <Card className="bg-white/10 text-white backdrop-blur-2xl">
          <CardHeader className="pt-6 pb-4">
            <CardTitle className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Universal Unit Converter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-white/80">
              Real-time currency + offline length, weight, and temperature
              conversions.
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {["currency", "length", "weight", "temperature"].map((k) => (
                <Button
                  key={k}
                  variant={kind === k ? "default" : "outline"}
                  className={kind === k ? "" : "text-black"}
                  size="sm"
                  onClick={() => setKind(k as ConverterKind)}
                >
                  {k.charAt(0).toUpperCase() + k.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={0}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>From</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {kind === "currency" && (
              <div className="mt-3 text-sm">
                {loadingRates && <span>Fetching live rates…</span>}
                {!loadingRates && apiError && (
                  <span className="text-red-400">API error: {apiError}</span>
                )}
                {!loadingRates && !apiError && rates?.date && (
                  <span>Rates Updated date: {rates.date}</span>
                )}
              </div>
            )}

            <div className="mt-6 rounded-xl bg-white/10 p-4 ring-1 ring-white/20">
              <div className="text-sm text-white/70">Converted</div>
              <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
                {formatted ? `${formatted} ${toUnit}` : "—"}
              </div>
            </div>

            <div className="mt-6 text-xs text-white/70">
              Currency via{" "}
              <Link href="https://exchangerate.host" className="underline">
                exchangerate.host
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
