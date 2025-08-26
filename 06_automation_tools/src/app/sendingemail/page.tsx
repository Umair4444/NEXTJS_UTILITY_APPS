"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  "from-email": z.email("Email is required"),
  "to-email": z.email("Email is required"),
  message: z.string().min(5, "Message is required"),
});

type FormData = z.infer<typeof schema>;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
      reset();
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Send an Email</h1>
          {sent && (
            <p className="text-green-600 text-center mb-3">
              ✅ Email sent successfully!
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Your Name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <Input
              type="email"
              placeholder="Your Email"
              {...register("from-email")}
            />
            {errors["from-email"] && (
              <p className="text-red-500 text-sm">
                {errors["from-email"]?.message}
              </p>
            )}

            <Input
              type="email"
              placeholder="Sent to Email"
              {...register("to-email")}
            />
            {errors["to-email"] && (
              <p className="text-red-500 text-sm">
                {errors["to-email"].message}
              </p>
            )}

            <Textarea
              placeholder="Your Message"
              rows={4}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
