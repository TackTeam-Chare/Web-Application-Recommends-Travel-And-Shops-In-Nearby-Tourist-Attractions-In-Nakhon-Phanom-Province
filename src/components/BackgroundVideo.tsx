"use client";

import React from "react";

const BackgroundVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/nakhon_phanom.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
        {/* Content over the video, like headers, buttons, etc. */}
        <h1 className="text-white text-3xl md:text-5xl font-bold">นครพนม</h1>
      </div>
    </div>
  );
};

export default BackgroundVideo;
