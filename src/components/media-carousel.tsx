"use client";

import type { Media } from '@/lib/types';
import { MediaCard } from './media-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { scrollReveal, staggerContainer } from '@/lib/animations';

interface MediaCarouselProps {
  media: Media[];
  title?: string;
  className?: string;
  headingClassName?: string;
}

export function MediaCarousel({ media, title, className, headingClassName }: MediaCarouselProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className={cn("w-full py-8", className)}
      {...scrollReveal}
    >
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
        {title && (
          <motion.h2 
            className={cn("text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent", headingClassName)}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {title}
          </motion.h2>
        )}
      <motion.div {...staggerContainer}>
        <Carousel
          opts={{
            align: "start",
            loop: media.length > 8,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {media.map((item, index) => (
              <CarouselItem key={`${item.type}-${item.id}`} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/7 xl:basis-1/8 pl-4">
                <motion.div 
                  className="aspect-[2/3]"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5,
                    delay: Math.min(index * 0.05, 0.3),
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <MediaCard media={item} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/** Buttons removed: carousel is mouse drag only */}
        </Carousel>
      </motion.div>
      </div>
    </motion.section>
  );
}