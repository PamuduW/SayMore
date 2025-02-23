"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Brain, Target, LineChart, Instagram, Linkedin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import HomeSection from "@/components/home";
import FeaturesSection from "@/components/features";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              SayMore
            </a>
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span></span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-gray-900"
                onClick={e => {
                  e.preventDefault();
                  document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
                }}>
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Features
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Process
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Team
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                FAQ
              </a>
              <Button className="bg-orange-500 hover:bg-orange-600">Contact Us</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <HomeSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Process */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-purple-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Your Speech</h3>
              <p className="text-gray-600">
                Use our app to record your speech during practice sessions or real conversations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get AI Analysis</h3>
              <p className="text-gray-600">
                Receive detailed feedback on your speech patterns, pacing, and areas for improvement
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice & Improve</h3>
              <p className="text-gray-600">
                Follow personalized exercises and track your progress over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-purple-600 via-white to-pink-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <Button variant="outline">Explore All Members</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Speech Pathologist",
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
              },
              {
                name: "Mark Thompson",
                role: "AI Research Lead",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
              },
              {
                name: "Lisa Rodriguez",
                role: "Public Speaking Coach",
                image:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
              },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={600}
                  height={256}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
                Absolutely. We take your privacy seriously. All your practice sessions and personal
                data are encrypted and stored securely on our servers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">SayMore</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/saymore-official-1b5b3b344/"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/say.more_official/"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>Home</li>
                <li>Features</li>
                <li>Process</li>
                <li>Team</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Other</h4>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Support</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p>925 Filbert Street</p>
              <p>Pennsylvania 18072</p>
              <p>+45 3411-4411</p>
              <p>info@saymore.com</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p>© 2024 SayMore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
