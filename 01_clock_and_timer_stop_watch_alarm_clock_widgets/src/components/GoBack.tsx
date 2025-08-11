import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const GoBack = () => {
  const router = useRouter();
  return (
    <div className="text-white">
      <Button
        className="bg-blue-600 rounded-xl hover:bg-blue-800"
        onClick={() => router.push("/")}
      >
        Go To Home
      </Button>
    </div>
  );
};

export default GoBack;
