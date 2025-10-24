"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import type { Media } from "@/lib/types";

interface HeroSectionProps {
  media: Media;
  linkPrefix?: string;
}

/**
 * Hero section with smooth animations for featured content
 */
export function HeroSection({ media, linkPrefix = "movie" }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image with Zoom Animation */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.1, 0.25, 1] 
        }}
      >
        <Image
          src={media.imageUrl}
          alt={`Poster for ${media.title}`}
          fill
          quality={85}
          sizes="100vw"
          className="object-cover opacity-40"
          priority
          data-ai-hint={media['data-ai-hint']}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-left max-w-screen-2xl">
        <div className="max-w-xl">
          {/* Title Animation */}
          <motion.h1
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-lg"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {media.title}
          </motion.h1>

          {/* Description Animation */}
          <motion.p
            className="mt-4 text-lg max-w-2xl text-white/80 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {media.description}
          </motion.p>

          {/* Button Animation */}
          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 17 
              }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/50"
              >
                <Link href={`/media/${linkPrefix}-${media.id}`}>
                  <PlayCircle className="mr-2 h-6 w-6" />
                  Play
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}