import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-purple-600 via-white to-pink-400">
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
  );
}
