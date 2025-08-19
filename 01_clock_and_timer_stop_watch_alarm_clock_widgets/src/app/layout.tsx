import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clock & Timer Widgets",
  description: "Digital Clock, Stopwatch, Timer & Alarm built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        {children}

        {/* Global toaster notifications */}
        <Toaster />
        <Footer/>
      </body>

    </html>
  );
}
