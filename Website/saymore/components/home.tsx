import { Button } from "@/components/ui/button";
import { Mic, Brain, LineChart } from "lucide-react";
import Image from "next/image";

export default function HomeSection() {
  return (
      <section
          id="home"
          className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-purple-50 via-white to-pink-50">

        <div className="absolute inset-0 overflow-hidden">
          {/* Background Image */}
          <Image
              src="/Banner.jpg"
              alt="Background"
              className="w-full h-full object-cover opacity-100"
          />

          {/* Colored Blur Circles */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-purple-200 rounded-full blur-2xl opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl opacity-20"></div>
          <div className="absolute top-40 right-1/4 w-24 h-24 bg-blue-200 rounded-full blur-2xl opacity-20"></div>

          {/* Floating Icons */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 animate-float">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <Mic className="w-6 h-6 text-red-300" />
            </div>
          </div>
          <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 animate-float-delayed">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 animate-float">
            <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <LineChart className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              IF YOU CAN
              <div className="relative inline-block mx-4">
              <span className="relative z-10 bg-white text-black px-6 py-2 rounded-lg">
                THINK IT
              </span>
                <div className="absolute inset-0 bg-orange-300 rounded-lg transform rotate-3"></div>
              </div>
              <br />
              WE CAN HELP YOU SAY IT
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your public speaking journey with AI-powered coaching and real-time feedback
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="outline" className="border-2">
                Checkout
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
  );
}
