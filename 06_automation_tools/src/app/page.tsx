"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaMagic, FaEnvelope } from "react-icons/fa";
import React from "react";

const Page = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&w=1920&q=80')", // Unsplash background
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Fortune Teller Card */}
        <Card className="group relative w-80 p-1 rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 shadow-2xl transition-transform duration-300 hover:scale-105">
          <div className="rounded-2xl backdrop-blur-lg bg-black/40 p-6 flex flex-col justify-between h-full">
            <CardHeader className="text-center">
              <FaMagic className="text-5xl mx-auto mb-4 text-white/90 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-2xl font-bold text-white">
                Fortune Teller
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                asChild
                className="w-full rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                <Link href="/fortune-teller">Explore</Link>
              </Button>
            </CardContent>
          </div>
        </Card>

        {/* Sending Mail Card */}
        <Card className="group relative w-80 p-1 rounded-3xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-green-400 shadow-2xl transition-transform duration-300 hover:scale-105">
          <div className="rounded-2xl backdrop-blur-lg bg-black/40 p-6 flex flex-col justify-between h-full">
            <CardHeader className="text-center">
              <FaEnvelope className="text-5xl mx-auto mb-4 text-white/90 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-2xl font-bold text-white">
                Sending Mail
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                asChild
                className="w-full rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                <Link href="/sendingemail">Send</Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
