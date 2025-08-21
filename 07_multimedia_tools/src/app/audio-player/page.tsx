import GoBack from "@/components/GoBack";
import ModernAudioPlayer from "@/components/ModernAudioPlayer3";
import React from "react";

const page = () => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-4">
        <GoBack />
      </div>
      <ModernAudioPlayer />
    </div>
  );
};

export default page;
