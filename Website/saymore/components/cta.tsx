import { Button } from "@/components/ui/button";
import React from "react";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

export default function CTASection() {
  return (
    // <section id="cta" className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-7xl mx-auto text-center">
    //     <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Speaking Skills?</h2>
    //     <p className="text-xl mb-8">
    //       Join thousands of users who have improved their public speaking confidence with SayMore.
    //     </p>
    //     <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
    //       Start Your Journey
    //     </Button>
    //   </div>
    // </section>

    <div className="h-96 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <h2 className={cn("md:text-4xl text-xl text-white relative z-20")}>
        Ready to Transform Your Speaking Skills?
      </h2>
      <p className="text-center mt-2 text-neutral-300 relative z-20">
        Join thousands of users who have improved their public speaking confidence with SayMore.
      </p>
      <Button size="lg" className="text-center mt-2 text-neutral-300 relative z-20 bg-blue-600 hover:bg-blue-700">
        Start Your Journey
      </Button>
    </div>
  );
}
