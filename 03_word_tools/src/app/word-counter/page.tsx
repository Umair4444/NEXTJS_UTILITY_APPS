import BackButton from "@/components/BackButton";
import WordCounter from "@/components/WordCounter";
import React from "react";

const page = () => {
  return (
    <div className="relative">
      <div className="bg-transparent absolute top-3 left-3 ">
        <BackButton />
      </div>
      <WordCounter />
    </div>
  );
};

export default page;
