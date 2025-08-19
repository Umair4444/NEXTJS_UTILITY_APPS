import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid grid-rows-[2fr_auto_2fr] place-items-center grid- bg-gradient-to-tr from-indigo-900 via-black to-gray-900 p-6">
      {/* Title */}
      <div className="">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 drop-shadow-lg text-center">
          Clock & Timer Utility Widgets
        </h1>
        <p className="text-gray-300 text-center opacity-75">
          Choose a clock or timer demo to see a beautiful responsive design in
          action.
        </p>
      </div>

      {/* Navigation */}
      <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 rounded-xl w-full max-w-6xl">
        {[
          { href: "/analog_clock", label: "Analog Wall Clock" },
          { href: "/analog_clock2", label: "Analog Clock" },
          { href: "/digital_clock", label: "Digital Clock" },
          { href: "/countdown_timer", label: "Countdown Timer" },
          { href: "/pomodoro_timer", label: "Pomodoro Timer" },
          { href: "/stopwatch", label: "Stop Watch" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-3 sm:px-6 sm:py-4 bg-indigo-700 hover:bg-indigo-600 transition rounded-xl text-white text-base sm:text-lg font-semibold shadow-md hover:shadow-xl text-center w-full"
          >
            {label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
