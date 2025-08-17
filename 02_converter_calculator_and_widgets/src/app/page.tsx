import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const links = [
    { href: "/bmi-calculator", label: "BMI Calculator" },
    { href: "/calculator", label: "Scientific Calculator" },
    { href: "/tip-calculator", label: "Tip Calculator" },
    { href: "/weather", label: "Weather Report" },
    { href: "/unit-converter-1", label: "Unit Converter 1" },
    { href: "/unit-converter-2", label: "Unit Converter 2" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-xl bg-slate-800/70 rounded-xl p-4 text-center">
        Utility Tools Dashboard
      </h1>

      {/* Buttons Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="w-full">
            <Button
              variant="secondary"
              className="w-full px-6 py-4 bg-slate-700/70 hover:bg-slate-700/80 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              {link.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Footer/Attribution */}
      <div className="mt-12 text-sm text-white/70 text-center">
        Powered by Next.js & ShadCN UI
      </div>
    </main>
  );
}
