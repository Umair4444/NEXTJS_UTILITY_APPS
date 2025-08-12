import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const links = [
    { href: "/bmi-calculator", label: "BMI Calculator" },
    { href: "/calculator", label: "Scientific Calculator" },
    { href: "/tip-calculator", label: "Tip Calculator" },
    { href: "/weather", label: "Weather Report" },
  ];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <h1 className="text-3xl font-bold text-white drop-shadow-lg bg-slate-600/80 rounded-[10px] p-2 ">
        Utility Tools Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button
              variant="secondary"
              className="w-full bg-slate-400/50 hover:bg-slate-400/20 px-2 rounded-[12px] text-lg font-semibold shadow-md hover:scale-105 transition-transform"
            >
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </main>
  );
}
