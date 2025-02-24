import { Button } from "@/components/ui/button";
import React from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export default function CTASection() {
  const words = [
    {
      text: "Ready",
    },
    {
      text: "to",
    },
    {
      text: "Transform",
    },
    {
      text: "Your",
    },
    {
      text: "Speaking",
    },
    {
      text: "Skills",
    },
    {
      text: "with",
    },
    {
      text: "SayMore",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "?",
    },
  ];

  return (
    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <h2 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        <TypewriterEffectSmooth words={words} />
      </h2>
      <p className="text-center mt-2 text-neutral-300 relative z-20 mb-10">
        Join thousands of users who have improved their public speaking confidence with SayMore.
      </p>
      <Button
        size="lg"
        className="text-center mt-2 text-neutral-300 relative z-20 bg-blue-600 hover:bg-blue-700">
        Start Your Journey
      </Button>
    </div>
  );
}
