"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Check } from 'lucide-react';
import type { Media } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/context/watchlist-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  media: Media;
  onWatchlistPage?: boolean;
}

export function MediaCard({ media, onWatchlistPage = false }: MediaCardProps) {
  const router = useRouter();
  const { addToWatchlist, removeFromWatchlist, isMediaInWatchlist } = useWatchlist();
  const { toast } = useToast();
  const mediaId = `${media.type}-${media.id}`;
  const inWatchlist = isMediaInWatchlist(mediaId);

  const handleCardClick = () => {
    router.push(`/media/${mediaId}`);
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(mediaId);
      toast({
        description: `"${media.title}" removed from your watchlist.`,
      });
    } else {
      addToWatchlist(mediaId);
      toast({
        description: `"${media.title}" added to your watchlist.`,
      });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="block group relative overflow-hidden rounded-lg h-full cursor-pointer select-none transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50"
    >
      <div className="w-full h-full overflow-hidden">
        <Image
          src={media.posterUrl}
          alt={media.title}
          width={500}
          height={750}
          quality={90}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
          className="object-cover w-full h-full select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110"
          draggable={false}
          data-ai-hint={media['data-ai-hint']}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
      <div className="absolute bottom-0 left-0 p-4 w-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <h3 className="font-bold text-lg text-white drop-shadow-md">{media.title}</h3>
        <p className="text-sm text-gray-300 drop-shadow-md">{media.year}</p>
      </div>
      <div className={cn(
        "absolute top-2 right-2 transition-all duration-500 ease-out group-hover:translate-y-2",
        (onWatchlistPage || inWatchlist) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <Button
          size="icon"
          variant="ghost"
          className="h-9 w-9 text-white bg-black/30 hover:bg-primary hover:text-white rounded-full transition-all duration-500 ease-out hover:scale-110"
          onClick={handleWatchlistClick}
          aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >          {inWatchlist ? <Check className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}