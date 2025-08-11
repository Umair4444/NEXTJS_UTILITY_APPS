import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-900 via-black to-gray-900 p-6">
      <h1 className="text-5xl font-extrabold text-white mb-12 drop-shadow-lg text-center">
        Clock & Timer Demos
      </h1>
      <nav className="flex flex-col sm:flex-row gap-6 sm:gap-12">
        {[
          { href: "/analog_clock", label: "Analog Wall Clock" },
          { href: "/analog_clock2", label: "Analog Clock" },
          { href: "/digital_clock", label: "Digital Clock" },
          { href: "/countdown_timer", label: "Countdown Timer" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-6 py-4 bg-indigo-700 hover:bg-indigo-600 transition rounded-lg text-white text-lg font-semibold shadow-md hover:shadow-xl text-center min-w-[180px]"
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="text-gray-300 mt-12 max-w-md text-center opacity-75">
        Choose a clock or timer demo to see a beautiful responsive design in action.
      </p>
    </main>
  );
}
