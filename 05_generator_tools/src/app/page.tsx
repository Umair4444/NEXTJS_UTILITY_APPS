"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const pages = [
    { name: "Birthday Celebration", path: "/birthday-celebration" },
    { name: "Birthday Wish", path: "/birthday-wish" },
    { name: "Color Picker", path: "/color-picker" },
    { name: "HTML Preview", path: "/html-preview" },
    { name: "Joke Generator", path: "/joke-generator" },
    { name: "Meme Generator", path: "/meme-generator" },
    { name: "Password Generator", path: "/password-generator" },
    { name: "URL Shortener", path: "/url-shortener" },
  ];

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        {pages.map((page) => (
          <Card
            key={page.path}
            className="bg-transparent/5 dark:bg-black/70 backdrop-blur-lg shadow-lg hover:shadow-2xl transition rounded-2xl"
          >
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                {page.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={page.path}>Go to {page.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
