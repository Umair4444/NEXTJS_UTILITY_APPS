"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("");
  const [people, setPeople] = useState("1");
  const [totalTip, setTotalTip] = useState<number | null>(null);
  const [perPerson, setPerPerson] = useState<number | null>(null);

  const calculateTip = () => {
    const billAmount = parseFloat(bill);
    const tip = parseFloat(tipPercent);
    const numPeople = parseInt(people);

    if (!billAmount || !tip || numPeople < 1) {
      setTotalTip(null);
      setPerPerson(null);
      return;
    }

    const totalTipValue = billAmount * (tip / 100);
    setTotalTip(parseFloat(totalTipValue.toFixed(2)));

    const totalPerPerson = (billAmount + totalTipValue) / numPeople;
    setPerPerson(parseFloat(totalPerPerson.toFixed(2)));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <Card className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Tip Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="number"
            placeholder="Bill Amount"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Tip Percentage (%)"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Number of People"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
          <Button className="w-full" onClick={calculateTip}>
            Calculate Tip
          </Button>

          {totalTip !== null && perPerson !== null && (
            <div className="text-center mt-4">
              <p className="text-lg font-semibold">Total Tip: ${totalTip}</p>
              <p className="text-sm text-gray-700">
                Each Person Pays: ${perPerson}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
