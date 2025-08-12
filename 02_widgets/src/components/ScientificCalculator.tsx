"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";

export default function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const [isScientific, setIsScientific] = useState(false);

  const handleClick = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => setExpression("");

  const handleCalculate = () => {
    try {
      // Replace math functions with JavaScript equivalents
      const exp = expression
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/pow\(/g, "Math.pow(");

      setExpression(eval(exp).toString());
    } catch {
      setExpression("Error");
    }
  };

  const buttons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];
  const sciButtons = ["sin(", "cos(", "tan(", "log(", "sqrt(", "pow("];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Next.js Calculator</h1>
        <Input
          value={expression}
          readOnly
          className="mb-4 text-lg font-mono"
        />

        <div className="flex justify-between items-center mb-4">
          <Button variant="destructive" onClick={handleClear}>Clear</Button>
          <Toggle pressed={isScientific} onPressedChange={setIsScientific}>
            {isScientific ? "Scientific" : "Simple"}
          </Toggle>
        </div>

        {isScientific && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {sciButtons.map((btn) => (
              <Button key={btn} onClick={() => handleClick(btn)}>
                {btn}
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => (btn === "=" ? handleCalculate() : handleClick(btn))}
            >
              {btn}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
