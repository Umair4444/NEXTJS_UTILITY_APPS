"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Type for the kind of conversion (only allows these 4 values)
type ConverterKind = "currency" | "length" | "weight" | "temperature";

// Type for currency API response
type CurrencyRates = {
  base: string; // Base currency (e.g., "USD")
  rates: Record<string, number>; // Mapping of currency -> rate
  date?: string; // Optional date for rates
};

// Conversion factors for length (relative to meters)
const LENGTH_UNITS = [
  { unit: "m", factor: 1 }, // base
  { unit: "km", factor: 1000 },
  { unit: "cm", factor: 0.01 },
  { unit: "mm", factor: 0.001 },
  { unit: "mi", factor: 1609.344 },
  { unit: "yd", factor: 0.9144 },
  { unit: "ft", factor: 0.3048 },
  { unit: "in", factor: 0.0254 },
];

// Conversion factors for weight (relative to kilograms)
const WEIGHT_UNITS = [
  { unit: "kg", factor: 1 }, //base
  { unit: "g", factor: 0.001 },
  { unit: "lb", factor: 0.45359237 },
  { unit: "oz", factor: 0.028349523125 },
];

// Temperature units (Celsius, Fahrenheit, Kelvin)
const TEMP_UNITS = ["C", "F", "K"] as const;

// Common currencies to display in dropdown
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

// ---------------------- Utility functions ---------------------- //

// Converts using unit factors (length/weight)
function convertByFactor(
  value: number,
  fromUnit: string,
  toUnit: string,
  units: { unit: string; factor: number }[]
) {
  const from = units.find((u) => u.unit === fromUnit)?.factor; // factor of fromUnit
  const to = units.find((u) => u.unit === toUnit)?.factor; // factor of toUnit
  if (from == null || to == null) return NaN; // invalid case
  return (value * from) / to; // convert to base unit, then to target
}

// Converts between Celsius, Fahrenheit, Kelvin
function convertTemperature(
  value: number,
  from: (typeof TEMP_UNITS)[number],
  to: (typeof TEMP_UNITS)[number]
) {
  let kelvin: number; // normalize everything to Kelvin
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

// Helper to merge conditional class names
function classNames(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

// ---------------------- Main Component ---------------------- //

export default function UnitConverter() {
  const router = useRouter(); // for back navigation

  // State for converter type (currency/length/weight/temp)
  const [kind, setKind] = useState<ConverterKind>("currency");

  // Amount entered by the user
  const [amount, setAmount] = useState<number>(1);

  // Current "from" and "to" units
  const [fromUnit, setFromUnit] = useState<string>("USD");
  const [toUnit, setToUnit] = useState<string>("PKR");

  // Currency exchange rate states
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch live currency rates when kind = "currency"
  useEffect(() => {
    if (kind !== "currency") return; // skip for other types

    let ignore = false; // safeguard to avoid updating unmounted component

    async function loadRates() {
      try {
        setLoadingRates(true);
        setApiError(null);

        const res = await fetch(
          // `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}&currencies=${toUnit}&base_currency=${fromUnit}`,
          `https://api.exchangerate-api.com/v4/latest/USD`,
          { cache: "no-store" }
        );
        // console.log("res >>>>> ", res);

        if (!res.ok) throw new Error("Failed to fetch exchange rates");

        const data = await res.json(); // API response
        // console.log("data >>>>>>> ", data); // optional debug

        if (!ignore) {
          setRates({
            base: data.base,
            rates: data.rates,
            date: data.date,
          });
        }
      } catch (e: any) {
        if (!ignore) setApiError(e?.message ?? "Unknown error");
      } finally {
        if (!ignore) setLoadingRates(false);
      }
    }

    loadRates();
    return () => {
      ignore = true;
    }; // cleanup if component unmounts
  }, [kind]);

  // Reset default units when kind changes
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

  // Compute conversion result
  const result = useMemo(() => {
    if (Number.isNaN(amount)) return ""; // invalid input

    if (kind === "currency") {
      if (!rates || !rates.rates) return ""; // rates not loaded
      const fromRate = fromUnit === rates.base ? 1 : rates.rates[fromUnit]; // from factor
      const toRate = toUnit === rates.base ? 1 : rates.rates[toUnit]; // to factor
      if (!fromRate || !toRate) return "";
      const usdAmount = amount / fromRate; // convert to base (USD)
      const converted = usdAmount * toRate; // convert to target
      return converted;
    }

    if (kind === "length") {
      return convertByFactor(amount, fromUnit, toUnit, LENGTH_UNITS);
    }
    if (kind === "weight") {
      return convertByFactor(amount, fromUnit, toUnit, WEIGHT_UNITS);
    }
    if (kind === "temperature") {
      return convertTemperature(amount, fromUnit as any, toUnit as any);
    }
    return "";
  }, [amount, fromUnit, toUnit, kind, rates]);

  // Format result for display (with commas, up to 6 decimals)
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

  // Generate unit dropdown options depending on kind
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

  // ---------------------- UI Layout ---------------------- //

  return (
    <div
      className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1591033594798-33227a05780d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9yZXglMjBleGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D')] 
                bg-cover bg-center relative"
    >
      {/* Background overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main container */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-10 sm:py-16">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-white backdrop-blur-md ring-1 ring-white/20 hover:bg-white/20 transition"
        >
          {/* Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M10.72 3.72a.75.75 0 010 1.06L5.56 10h13.69a.75.75 0 010 1.5H5.56l5.16 5.22a.75.75 0 11-1.07 1.05l-6.5-6.57a.75.75 0 010-1.05l6.5-6.5a.75.75 0 011.07 0z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>

        {/* Card container */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 sm:p-8 text-white backdrop-blur-2xl shadow-xl">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Universal Unit Converter
          </h1>
          <p className="mt-2 text-white/80">
            Real-time currency + offline length, weight, and temperature
            conversions.
          </p>

          {/* Kind selection buttons */}
          <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            {(
              [
                { key: "currency", label: "Currency" },
                { key: "length", label: "Length" },
                { key: "weight", label: "Weight" },
                { key: "temperature", label: "Temperature" },
              ] as { key: ConverterKind; label: string }[]
            ).map((k) => (
              <button
                key={k.key}
                onClick={() => setKind(k.key)}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm sm:text-base ring-1 transition",
                  kind === k.key
                    ? "bg-white text-black ring-white"
                    : "bg-white/10 text-white ring-white/30 hover:bg-white/20"
                )}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Input fields */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount input */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                min={0}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/20 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter value"
              />
            </div>

            {/* From/To selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-white/80 mb-2">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u} className="bg-slate-900">
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/80 mb-2">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u} className="bg-slate-900">
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Converted result display */}
          <div className="mt-6">
            {kind === "currency" && (
              <div className="mb-3 text-sm">
                {loadingRates && (
                  <span className="opacity-80">Fetching live rates…</span>
                )}
                {!loadingRates && apiError && (
                  <span className="text-red-200">API error: {apiError}</span>
                )}
                {!loadingRates && !apiError && rates?.date && (
                  <span className="opacity-80">
                    Rates Updated date: {rates.date}
                  </span>
                )}
              </div>
            )}

            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
              <div className="text-sm text-white/70">Converted</div>
              <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
                {formatted ? `${formatted} ${toUnit}` : "—"}
              </div>
            </div>
          </div>

          {/* Attribution */}
          <div className="mt-6 text-xs text-white/70">
            Currency via{" "}
            <Link href="https://exchangerate.host" className="underline">
              exchangerate.host
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
