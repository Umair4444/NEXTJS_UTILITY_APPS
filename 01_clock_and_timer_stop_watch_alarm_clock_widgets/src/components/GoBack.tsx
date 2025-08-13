import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface GoBackProps {
  className?: string;
  showText?: boolean;
}

export function GoBack({ className, showText = true }: GoBackProps) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      onClick={() => router.back()}
      className={`flex items-center gap-2 bg-white/10 border-white/60 text-white hover:scale-105 border  ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {showText && <span className="">Back</span>}
    </Button>
  );
}

export default GoBack;
