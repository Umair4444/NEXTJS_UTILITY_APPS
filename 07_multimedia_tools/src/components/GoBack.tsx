"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GoBack() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => router.back()}
    >
      <ArrowLeft size={18} />
      Go Back
    </Button>
  );
}
