"use client";

import HomeSection from "@/components/home";
import FeaturesSection from "@/components/features";
import ProcessSection from "@/components/process";
import TeamSection from "@/components/team";
import Navigation from "@/components/navigation";
import FAQSection from "@/components/faq";
import Footer from "@/components/footer";
import CTASection from "@/components/cta";

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
      <CTASection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
