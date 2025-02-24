import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function TeamSection() {
  return (
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <Button variant="outline">Explore All Members</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Pamudu Wijesinghe",
                role: "Team Lead",
                email: "pamudu.20232412@iit.ac.lk",
                image: "/Pamudu.jpg",
                width: 339,
                height: 313,
              },
              {
                name: "Disini Hettige",
                role: "Frontend Lead",
                email: "disini.20222171@iit.ac.lk",
                image: "/Disini.jpg",
                width: 1077,
                height: 895,
              },
              {
                name: "Janindu Sandanayake",
                role: "Outreach Lead",
                email: "janindu.20232270@iit.ac.lk",
                image: "/Janindu.jpg",
                width: 338,
                height: 302,
              },
              {
                name: "Arani Weerathunga",
                role: "Research Lead",
                email: "arani.20231178@iit.ac.lk",
                image: "/Arani.jpg",
                width: 336,
                height: 316,
              },
              {
                name: "Kanila Gunasekara",
                role: "Design Lead",
                email: "kanila.20232485@iit.ac.lk",
                image: "/Kanila.jpg",
                width: 339,
                height: 310,
              },
              {
                name: "Himara Anne",
                role: "Document Lead",
                email: "himara.20231617@iit.ac.lk",
                image: "/Himara.jpg",
                width: 337,
                height: 316,
              },
            ].map((member, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg group">
                  <Card className="relative">
                    <Image
                        src={member.image}
                        alt={member.name}
                        width={member.width}
                        height={member.height}
                        className="w-full h-80 object-cover" // Increased height from h-64 to h-80
                    />

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-black/70 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-gray-300">{member.role}</p>
                      <p className="text-gray-400 text-sm hover:text-blue-400">
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </p>
                    </div>
                  </Card>
                </div>
            ))}
          </div>
        </div>
      </section>
  );
}
