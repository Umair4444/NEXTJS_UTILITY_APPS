import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-8 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Hero Section */}
      <section className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Explore My Modern Multimedia Tools
        </h1>
        <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-md">
          Interactive components built with Next.js 14, ShadCN UI.
        </p>
      </section>

      {/* Cards Section */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {/* Image Slider Card */}
        <Link href="/image-slider">
          <Card className="hover:scale-105 transition-transform cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 w-full h-[300px] flex flex-col">
            <div className="flex-1 w-full relative">
              <Image
                src="https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=400&q=80"
                alt="Image Slider"
                fill
                className="rounded-t-md object-cover"
              />
            </div>
            <CardContent className="flex flex-col items-center justify-end gap-2 p-4 mt-auto">
              <h2 className="text-xl font-semibold text-white text-center">
                Modern Image Slider
              </h2>
              <p className="text-white/80 text-center text-sm line-clamp-2">
                Interactive and responsive image slider built with Next.js.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Audio Player Card */}
        <Link href="/audio-player">
          <Card className="hover:scale-105 transition-transform cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 w-full h-[300px] flex flex-col">
            <div className="flex-1 w-full relative">
              <Image
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
                alt="Audio Player"
                fill
                className="rounded-t-md object-cover"
              />
            </div>
            <CardContent className="flex flex-col items-center justify-end gap-2 p-4 mt-auto">
              <h2 className="text-xl font-semibold text-white text-center">
                Modern Audio Player
              </h2>
              <p className="text-white/80 text-center text-sm line-clamp-2">
                Play and control audio tracks with stylish UI components.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Youtube Thumbnail Downloader */}
        <Link href="/yt-thumbnail-downloader">
          <Card className="hover:scale-105 transition-transform cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 w-full h-[300px] flex flex-col">
            <div className="flex-1 w-full relative">
              <Image
                src="https://images.unsplash.com/photo-1634942536846-e9863ef9e78f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHlvdXR1YmV8ZW58MHx8MHx8fDA%3D"
                alt="YouTube Thumbnail Downloader"
                fill
                className="rounded-t-md object-cover"
              />
            </div>
            <CardContent className="flex flex-col items-center justify-end gap-2 p-4 mt-auto">
              <h2 className="text-xl font-semibold text-white text-center line-clamp-2">
                Youtube Thumbnail Downloader
              </h2>
              <p className="text-white/80 text-center text-sm line-clamp-2">
                Download Youtube Thumbnails in all sizes.
              </p>
            </CardContent>
          </Card>
        </Link>
      </section>
    </main>
  );
}
