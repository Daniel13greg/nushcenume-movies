"use client";

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from './ui/button';
import { getSeasonDetails } from '@/services/tmdb';
import type { Episode, TmdbSeason } from '@/lib/types';
import { useLanguage } from '@/context/language-context';
import Image from 'next/image';
import { PlayCircle, Calendar, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import VideoPlayer from './video-player';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

interface SeasonsAccordionProps {
  seasons: TmdbSeason[];
  showId: number;
  showTitle: string;
}

function EpisodeSkeleton() {
    return (
        <div className="flex items-start gap-4 p-4 rounded-lg">
            <Skeleton className="w-40 h-24 flex-shrink-0 rounded-md" />
            <div className="flex-grow">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
                <Skeleton className="h-4 w-1/2 mt-3" />
            </div>
        </div>
    )
}

export default function SeasonsAccordion({ seasons, showId, showTitle }: SeasonsAccordionProps) {
  const [episodes, setEpisodes] = useState<Record<number, Episode[]>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const { language } = useLanguage();

  const handleSeasonClick = async (seasonNumber: number) => {
    if (episodes[seasonNumber]) {
      return;
    }
    setLoading(prevState => ({ ...prevState, [seasonNumber]: true }));
    try {
      const seasonDetails = await getSeasonDetails(showId.toString(), seasonNumber, language);
      setEpisodes(prevState => ({ ...prevState, [seasonNumber]: seasonDetails }));
    } catch (error) {
      console.error(`Failed to fetch details for season ${seasonNumber}:`, error);
    }
    setLoading(prevState => ({ ...prevState, [seasonNumber]: false }));
  };

  const seasonsToDisplay = seasons.filter(s => s.season_number > 0);

  return (
    <Accordion type="multiple" className="w-full">
      {seasonsToDisplay.map((season) => (
        <AccordionItem value={`season-${season.season_number}`} key={season.id} className="border-b-0">
          <AccordionTrigger onClick={() => handleSeasonClick(season.season_number)} className="border rounded-md px-4 my-2 text-left hover:no-underline">
            <div className="flex items-center gap-4 w-full">
              <Image
                src={season.poster_path ? `https://image.tmdb.org/t/p/w154${season.poster_path}` : 'https://placehold.co/154x231'}
                alt={season.name}
                width={80}
                height={120}
                quality={70}
                className="rounded-md object-cover"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{season.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(season.air_date).getFullYear()} | {season.episode_count} Episodes
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{season.overview}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {loading[season.season_number] && <div className='space-y-4'><EpisodeSkeleton /><EpisodeSkeleton /></div>}
            {episodes[season.season_number] && episodes[season.season_number].length > 0 ? (
              <div className="space-y-2">
                {episodes[season.season_number].map((episode) => (
                  <div key={episode.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/40 hover:bg-muted/80 transition-colors">
                    <div className="relative w-40 h-24 flex-shrink-0">
                      <Image
                        src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}`: 'https://placehold.co/780x439'}
                        alt={episode.name}
                        fill
                        quality={70}
                        sizes="160px"
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                        <div className='flex justify-between items-start'>
                            <h4 className="font-semibold text-base leading-tight pr-4">{episode.episode_number}. {episode.name}</h4>
                            <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                <PlayCircle className="h-7 w-7" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent showCloseButton={false} className="max-w-4xl p-0 bg-black border-0">
                                <DialogTitle className="sr-only">{`Play ${episode.name}`}</DialogTitle>
                                <VideoPlayer tmdbId={showId} type="show" season={season.season_number} episode={episode.episode_number} title={showTitle} episodeTitle={episode.name} />
                            </DialogContent>
                            </Dialog>
                        </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{episode.overview}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        <div className='flex items-center gap-1'>
                            <Calendar className='w-3.5 h-3.5' />
                            <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Star className='w-3.5 h-3.5' />
                            <span>{episode.vote_average.toFixed(1)}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                !loading[season.season_number] && <p className="text-muted-foreground p-4">No episodes found for this season.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}