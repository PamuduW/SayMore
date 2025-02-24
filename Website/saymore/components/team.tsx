import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function TeamSection() {
  return (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <Button variant="outline">Explore All Members</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[ // Add three more members here
              {
                name: "Pamudu Wijesinghe",
                role: "Team Lead",
                image:
                    "/Pamudu.jpg",
                width: 339,
                height: 313,
              },
              {
                name: "Disini Hettige",
                role: "Frontend Lead",
                image:
                    "/Disini.jpg",
                width: 1077,
                height: 895,
              },
              {
                name: "Janindu Sandanayake",
                role: "Outreach Lead",
                image:
                    "/Janindu.jpg",
                width: 338,
                height: 302,
              },
              {
                name: "Arani Weerathunga",
                role: "Research Lead",
                image:
                    "/Arani.jpg",
                width: 336,
                height: 316,
              },
              {
                name: "Kanila Gunasekara",
                role: "Design Lead",
                image:
                    "/Kanila.jpg",
                width: 339,
                height: 310,
              },
              {
                name: "Himara Anne",
                role: "Document Lead",
                image:
                    "/Himara.jpg",
                width: 337,
                height: 316,
              },
            ].map((member, index) => (
                <div
                    key={index}
                    className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Card>
                    <Image
                        src={member.image}
                        alt={member.name}
                        width={member.width}
                        height={member.height}
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  </Card>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}
