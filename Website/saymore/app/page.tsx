"use client";

import { Button } from "@/components/ui/button";
import HomeSection from "@/components/home";
import FeaturesSection from "@/components/features";
import ProcessSection from "@/components/process";
import TeamSection from "@/components/team";
import Navigation from "@/components/navigation";
import FAQSection from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Home Section */}
      <HomeSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Process */}
      <ProcessSection />

      {/* Team Section */}
      <TeamSection />

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Speaking Skills?</h2>
          <p className="text-xl mb-8">
            Join thousands of users who have improved their public speaking confidence with SayMore.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
