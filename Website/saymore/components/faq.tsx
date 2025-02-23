import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section
        id="faq"
        className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How does SayMore&rsquo;s AI analysis work?</AccordionTrigger>
            <AccordionContent>
              Our AI technology analyzes various aspects of your speech, including pace, clarity,
              filler words, and patterns. It provides real-time feedback and suggestions for
              improvement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I practice speaking in different scenarios?</AccordionTrigger>
            <AccordionContent>
              Yes! SayMore offers various practice scenarios, from casual conversations to formal
              presentations, helping you improve across different speaking situations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is my practice data private and secure?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We take your privacy seriously. All your practice sessions and personal data
              are encrypted and stored securely on our servers.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
