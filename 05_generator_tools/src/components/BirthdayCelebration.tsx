"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BackButton } from "./BackButton";

const balloons = ["🎈", "🎉", "🥳", "🎂", "🎊", "💖", "🍰"];

const BirthdayCelebration = () => {
  const [showWish, setShowWish] = useState(false);
  const [balloonIndex, setBalloonIndex] = useState(0);

  useEffect(() => {
    if (showWish) {
      const interval = setInterval(() => {
        setBalloonIndex((prev) => (prev + 1) % balloons.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showWish]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 text-white px-4">
      {/* Back Button fixed at top-left */}
      <div className="absolute top-4 left-4 z-10">
        <BackButton classname="bg-white/80 text-black shadow-md hover:bg-white" />
      </div>
      {!showWish ? (
        <Button
          onClick={() => setShowWish(true)}
          className="text-xl px-6 py-3 bg-yellow-400 text-black hover:bg-yellow-300 transition rounded-full"
        >
          Tap to Celebrate 🥳
        </Button>
      ) : (
        <div className="flex flex-col items-center space-y-6 text-center">
          <AnimatePresence>
            <motion.div
              key="balloon"
              className="text-6xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: -20, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {balloons[balloonIndex]}
            </motion.div>
          </AnimatePresence>

          <motion.h1
            className="text-4xl font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
          >
            🎂 Happy Birthday! 🎉
          </motion.h1>

          <motion.p
            className="text-lg max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Wishing you a day filled with happiness, love, and lots of cake!
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default BirthdayCelebration;
