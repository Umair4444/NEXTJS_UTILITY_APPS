"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function WordCounter() {
  const [text, setText] = useState("");

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  //   const wordCount = text.trim() === "" ? 0 : text.trim().split(' ').length; // count space as word
  const charCount = text.length;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center items-center"
      >
        <Card className="max-w-4xl w-full backdrop-blur-md bg-transparent/10 shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-white text-center">
              Word Counter App
            </h1>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="h-72 resize-none text-lg text-black  placeholder:text-gray-600"
            />
            <div className="flex justify-between text-white font-medium">
              <p>Words: {wordCount}</p>
              <p>Characters: {charCount}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
