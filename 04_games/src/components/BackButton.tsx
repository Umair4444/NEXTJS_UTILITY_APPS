"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  position = "top",
}: {
  position?: "top" | "bottom";
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`absolute ${
        position === "top" ? "top-4" : "bottom-4"
      } left-4 bg-transparent text-white px-4 py-2 rounded hover:text-blue-300 z-50`}
    >
      ⬅ Back
    </button>
  );
}
