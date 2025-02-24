import { FocusCards } from "@/components/ui/focus-cards";

export default function TeamSection() {
    const cards = [
        {
            title: "Pamudu Wijesinghe - Team Lead",
            src: "/Pamudu.jpg",
            linkedin: "https://www.linkedin.com/in/pamudu-wijesingha-837104294/",
            email: "pamudu.20232412@iit.ac.lk",
        },
        {
            title: "Disini Hettige - Frontend Lead",
            src: "/Disini.jpg",
            linkedin: "https://www.linkedin.com/in/disini-hettige-7a57a1270/",
            email: "disiniruhansa@gmail.com",
        },
        {
            title: "Janindu Sandanayake - Outreach Lead",
            src: "/Janindu.jpg",
            linkedin: "https://www.linkedin.com/in/janindu-sandanayaka/",
            email: "janindu2204@gmail.com",
        },
        {
            title: "Arani Weerathunga - Research Lead",
            src: "/Arani.jpg",
            linkedin: "https://www.linkedin.com/in/arani-weerathunga-8983b9295/",
            email: "araniweerathunga@gmail.com",
        },
        {
            title: "Kanila Gunasekara - Design Lead",
            src: "/Kanila.jpg",
            linkedin: "https://www.linkedin.com/in/kanila-gunasekara-4409021a7/",
            email: "kanilagroyal@gmail.com",
        },
        {
            title: "Himara Anne - Document Lead",
            src: "/Himara.jpg",
            linkedin: "https://www.linkedin.com/in/himara-joseph-607608297/",
            email: "himara.20231617@iit.ac.lk",
        },
    ];

    return (
        <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-16">Meet Our Team</h2>
                <FocusCards cards={cards} />
            </div>
        </section>
    );
}
