"use client";

import { useWatchlist } from '@/context/watchlist-context';
import Link from 'next/link';
import Image from 'next/image';
import { X, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { scrollReveal } from '@/lib/animations';

export function ContinueWatching() {
  const { continueWatching, removeFromContinueWatching } = useWatchlist();

  if (continueWatching.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <motion.div 
      className="w-full py-8"
      {...scrollReveal}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Continue Watching
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {continueWatching.map((item, index) => (
            <motion.div
              key={item.mediaId}
              className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.4,
                delay: Math.min(index * 0.1, 0.3),
                ease: [0.25, 0.1, 0.25, 1]
              }}
            >
              <Link href={`/media/${item.mediaId}`} className="block">
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {item.imageUrl && (
                    <div className="w-full h-full overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.title || 'Media'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0">
                    <Progress value={item.percentage} className="h-1 rounded-none" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  {item.type === 'show' && item.season && item.episode && (
                    <p className="text-xs text-muted-foreground mb-2">
                      S{item.season.toString().padStart(2, '0')}E{item.episode.toString().padStart(2, '0')}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{Math.round(item.percentage)}% complete</span>
                    <span>{formatTime(item.duration - item.currentTime)} left</span>
                  </div>
                </div>
              </Link>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-y-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white transition-all hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof window !== 'undefined') {
                      removeFromContinueWatching(item.mediaId);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}