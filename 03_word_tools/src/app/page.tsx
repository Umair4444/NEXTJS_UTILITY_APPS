import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="backdrop-blur-md bg-transparent/10 shadow-xl rounded-2xl p-8 flex flex-col gap-6 text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-white">Welcome</h1>
        <p className="text-white/80">Choose an app to get started:</p>
        <div className="flex flex-col gap-4">
          <Link
            href="/todo"
            className="px-4 py-2 bg-white/30 text-white font-medium rounded-lg hover:bg-white/40 transition"
          >
            Todo App
          </Link>
          <Link
            href="/word-counter"
            className="px-4 py-2 bg-white/30 text-white font-medium rounded-lg hover:bg-white/40 transition"
          >
            Word Counter App
          </Link>
        </div>
      </div>
    </div>
  );
}
