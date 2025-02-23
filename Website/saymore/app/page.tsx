"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Brain, Target, LineChart, Facebook, Twitter, Instagram } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span>
                  <span className="text-blue-600">SayMore</span>
                </span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                About us
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Features
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Team
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Review
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Pricing
              </a>
              <Button className="bg-orange-500 hover:bg-orange-600">Contact Us</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-purple-50 via-white to-pink-50">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-20 h-20 bg-purple-200 rounded-full blur-2xl opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-200 rounded-full blur-2xl opacity-20"></div>
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
                <span className="relative z-10 bg-orange-500 text-white px-6 py-2 rounded-lg">
                  IMAGINE IT
                </span>
                <div className="absolute inset-0 bg-orange-300 rounded-lg transform rotate-3"></div>
              </div>
              <br />
              WE CAN MAKE IT
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Transform your public speaking journey with AI-powered coaching and real-time feedback
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Learn More
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">
          Powerful features to enhance your speaking
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6">
            <Mic className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Analysis</h3>
            <p className="text-gray-600">Get instant feedback on your speech patterns and delivery</p>
          </Card>
          <Card className="p-6">
            <Brain className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-600">Advanced AI technology analyzes your speaking patterns</p>
          </Card>
          <Card className="p-6">
            <Target className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Goals</h3>
            <p className="text-gray-600">Set and track your speaking improvement goals</p>
          </Card>
          <Card className="p-6">
            <LineChart className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Monitor your improvement over time with detailed analytics</p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
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
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
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
              <AccordionTrigger>How does SayMore's AI analysis work?</AccordionTrigger>
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
                <Facebook className="w-6 h-6" />
                <Twitter className="w-6 h-6" />
                <Instagram className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>Home</li>
                <li>Features</li>
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Other</h4>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Support</li>
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
