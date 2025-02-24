import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="mb-4">
              <AccordionTrigger className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                How does SayMore&rsquo;s AI analysis work?
              </AccordionTrigger>
              <AccordionContent className="bg-white rounded-lg shadow-md p-4 transition-all duration-500">
                Our AI technology analyzes various aspects of your speech, including pace, clarity,
                filler words, and patterns. It provides real-time feedback and suggestions for
                improvement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="mb-4">
              <AccordionTrigger className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Can I practice speaking in different scenarios?
              </AccordionTrigger>
              <AccordionContent className="bg-white rounded-lg shadow-md p-4 transition-all duration-500">
                Yes! SayMore offers various practice scenarios, from casual conversations to formal
                presentations, helping you improve across different speaking situations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="mb-4">
              <AccordionTrigger className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Is my practice data private and secure?
              </AccordionTrigger>
              <AccordionContent className="bg-white rounded-lg shadow-md p-4 transition-all duration-500">
                Absolutely. We take your privacy seriously. All your practice sessions and personal
                data are encrypted and stored securely on our servers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="mb-4">
              <AccordionTrigger className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Does SayMore provide personalized feedback?
              </AccordionTrigger>
              <AccordionContent className="bg-white rounded-lg shadow-md p-4 transition-all duration-500">
                Yes, SayMore provides personalized feedback based on your speech recordings. After
                each practice session, the app analyzes your speech and provides insights into areas
                where you can improve, helping you to focus on specific aspects of your speech.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="mb-4">
              <AccordionTrigger className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors duration-300">
                Can I track my progress over time?
              </AccordionTrigger>
              <AccordionContent className="bg-white rounded-lg shadow-md p-4 transition-all duration-500">
                Yes, SayMore tracks your progress and provides detailed analytics, so you can monitor
                improvements in your speaking skills over time. You’ll be able to see trends in areas
                like pacing, clarity, and confidence.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
  );
}
