import { FocusCards } from "@/components/ui/focus-cards";

export default function TeamSection() {
    const cards = [
        {
            title: "Pamudu Wijesinghe",
            subtitle: "Team Lead",
            src: "/Pamudu.jpg",
            linkedin: "https://www.linkedin.com/in/pamudu-wijesingha-837104294/",
            github: "https://github.com/PamuduW",
            email: "pamuduwijesingha2k20@gmail.com",
        },
        {
            title: "Disini Hettige",
            subtitle: "Frontend Lead",
            src: "/Disini.jpg",
            linkedin: "https://www.linkedin.com/in/disini-hettige-7a57a1270/",
            github: "https://github.com/disiniruhansa",
            email: "disiniruhansa@gmail.com",
        },
        {
            title: "Janindu Sandanayake",
            subtitle: "Outreach Lead",
            src: "/Janindu.jpg",
            linkedin: "https://www.linkedin.com/in/janindu-sandanayaka/",
            github: "https://github.com/Janindu2204",
            email: "janindu2204@gmail.com",
        },
        {
            title: "Arani Weerathunga",
            subtitle: "Research Lead",
            src: "/Arani.jpg",
            linkedin: "https://www.linkedin.com/in/arani-weerathunga-8983b9295/",
            github: "https://github.com/aranisweerathunga",
            email: "araniweerathunga@gmail.com",
        },
        {
            title: "Kanila Gunasekara",
            subtitle: "Design Lead",
            src: "/Kanila.jpg",
            linkedin: "https://www.linkedin.com/in/kanila-gunasekara-4409021a7/",
            github: "https://github.com/KanilaGunasekara",
            email: "kanilagroyal@gmail.com",
        },
        {
            title: "Himara Anne",
            subtitle: "Document Lead",
            src: "/Himara.jpg",
            linkedin: "https://www.linkedin.com/in/himara-joseph-607608297/",
            github: "https://github.com/HimaraJoseph",
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
