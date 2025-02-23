import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section id="cta" className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Speaking Skills?</h2>
        <p className="text-xl mb-8">
          Join thousands of users who have improved their public speaking confidence with SayMore.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Start Your Journey
        </Button>
      </div>
    </section>
  );
}
