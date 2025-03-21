"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Card;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-80 md:h-96 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
      )}>
      <Image src={card.src} alt={card.title} fill className="object-cover absolute inset-0" />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0",
        )}>
        <div className="text-xl md:text-2xl font-medium text-white">{card.title}</div>
        <div className="text-l md:text-xl font-medium text-gray-400">{card.subtitle}</div>
        <div className="mt-2 flex space-x-4">
          {card.linkedin && (
            <a
              href={card.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <FontAwesomeIcon icon={faLinkedinIn} className="w-8 h-8 hover:text-blue-500" />
            </a>
          )}
          {card.github && (
            <a
              href={card.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <FontAwesomeIcon icon={faGithub} className="w-8 h-8 hover:text-blue-500" />
            </a>
          )}
          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300">
              <FontAwesomeIcon icon={faEnvelope} className="w-8 h-8 hover:text-blue-500" />
            </a>
          )}
        </div>
      </div>
    </div>
  ),
);

Card.displayName = "Card";

type Card = {
  title: string;
  subtitle: string;
  src: string;
  linkedin: string;
  github: string;
  email: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card key={card.title} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
