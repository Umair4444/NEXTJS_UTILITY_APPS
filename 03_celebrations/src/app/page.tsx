// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import birthdayImage from "@/assets/birthday.jpg";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image using next/image */}
      <Image
        src={birthdayImage}
        alt="Birthday Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Overlay (Glassmorphic Card) */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-lg border border-white/20 text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6">
          Birthday Celebration Styles
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/celebration1"
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-full transition"
          >
            🎉 Birthday Style 1
          </Link>
          <Link
            href="/celebration2"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-full transition"
          >
            🎈 Birthday Style 2
          </Link>
        </div>
      </div>
    </main>
  );
}
