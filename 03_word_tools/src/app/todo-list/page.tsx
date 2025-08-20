"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function NotesApp() {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // Load from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes));
    } else {
      localStorage.removeItem("notes");
    }
  }, [notes]);

  const addNote = () => {
    if (input.trim() === "") return;
    const newNotes = [input, ...notes]; // latest on top
    setNotes(newNotes);
    setInput("");
  };

  const deleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1920&q=80&auto=format&fit=crop')",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg bg-transparent/30 p-6 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Todo List
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            onClick={addNote}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
          >
            Add
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
          {notes.map((note, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-md text-white"
            >
              <button
                onClick={() => deleteNote(i)}
                className="absolute top-4 right-2 text-red-400 hover:text-red-600"
              >
                <Trash2 size={25} />
              </button>
              {note}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
