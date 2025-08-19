"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({
  label = "Back",
  classname,
}: {
  label?: string;
  classname?: string;
}) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={() => router.back()}
      className={`flex items-center gap-2 ${classname ?? ""}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
