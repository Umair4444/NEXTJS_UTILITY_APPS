import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeneratorTools",
  description: "A collection of fun and practical utilities built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gradient-to-br from-white to-blue-50 text-gray-800 min-h-screen flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
