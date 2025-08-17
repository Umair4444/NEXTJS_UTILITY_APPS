"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // convert cm to m

    if (!w || !h) {
      setBmi(null);
      setCategory("Please enter valid numbers.");
      return;
    }

    const bmiValue = w / (h * h);
    setBmi(parseFloat(bmiValue.toFixed(2)));

    if (bmiValue < 18.5) setCategory("Underweight");
    else if (bmiValue < 24.9) setCategory("Normal weight");
    else if (bmiValue < 29.9) setCategory("Overweight");
    else setCategory("Obese");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-left-top p-4"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1661265933107-85a5dbd815af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3ltfGVufDB8fDB8fHww')",
      }}
    >
      <Card className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">BMI Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Height in cm"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <Button className="w-full" onClick={calculateBMI}>
            Calculate BMI
          </Button>

          {bmi !== null && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">Your BMI: {bmi}</p>
              <p className="text-sm text-gray-700">{category}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
