import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export default function ProcessSection() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0.12, 0.8], [0, 1.6]);
  const pathLengthSecond = useTransform(scrollYProgress, [0.14, 0.8], [0, 1.6]);
  const pathLengthThird = useTransform(scrollYProgress, [0.16, 0.8], [0, 1.6]);
  const pathLengthFourth = useTransform(scrollYProgress, [0.18, 0.8], [0, 1.6]);
  const pathLengthFifth = useTransform(scrollYProgress, [0.2, 0.8], [0, 1.6]);

  return (
    <div
      id="process"
      className="h-[460vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-40 overflow-clip"
      ref={ref}>
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}
