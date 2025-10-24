"use client";                                        

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ExternalLink, Server, Clapperboard, MonitorPlay, Globe, Zap, Film, Play, Video, Tv, AlertCircle, SkipForward, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoPlayerProps {
  tmdbId: number;
  type: 'movie' | 'show';
  title: string;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  initialProviderId?: string;
}

type ProviderId =
  | 'torrent'
  | 'vidsrc'
  | 'vidsrcpro'
  | 'multiembed'
  | '2embed'
  | 'autoembed'
  | 'smashystream'
  | 'superembed'
  | 'vidsrcme'
  | 'vidplay';

type Provider = {
  id: ProviderId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  buildUrl: (
    type: 'movie' | 'show',
    tmdbId: number,
    season?: number,
    episode?: number
  ) => string;
};

// Ordered by typical reliability as of 2025-09
const PROVIDERS: Provider[] = [
  {
    id: 'torrent',
    name: 'Torrent (P2P)',
    icon: Download,
    buildUrl: (type, tmdbId, season, episode) => {
      const API_URL = process.env.NEXT_PUBLIC_TORRENT_API_URL || 'http://localhost:3000';
      const API_KEY = process.env.NEXT_PUBLIC_TORRENT_API_KEY || '2a452893104f67c7ec892d41fafd4265d3906e17657bd52664832d0f3df5f4c1';
      
      if (type === 'movie') {
        return `${API_URL}/embed/${tmdbId}?apikey=${API_KEY}&type=movie`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `${API_URL}/embed/${tmdbId}?apikey=${API_KEY}&type=tv&season=${s}&episode=${e}`;
    },
  },
  {
    id: 'vidsrc',
    name: 'VidSrc.to',
    icon: Server,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://vidsrc.to/embed/movie/${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://vidsrc.to/embed/tv/${tmdbId}/${s}/${e}`;
    },
  },
  {
    id: 'vidsrcpro',
    name: 'VidSrc.Pro',
    icon: Zap,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://vidsrc.pro/embed/movie/${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://vidsrc.pro/embed/tv/${tmdbId}/${s}/${e}`;
    },
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed',
    icon: Globe,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`;
    },
  },
  {
    id: '2embed',
    name: '2Embed',
    icon: Film,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://www.2embed.to/embed/tmdb/movie?id=${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://www.2embed.to/embed/tmdb/tv?id=${tmdbId}&s=${s}&e=${e}`;
    },
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed',
    icon: Globe,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://autoembed.to/tmdb/movie/${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://autoembed.to/tmdb/tv/${tmdbId}-${s}-${e}`;
    },
  },
  {
    id: 'smashystream',
    name: 'SmashyStream',
    icon: Clapperboard,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://player.smashy.stream/movie/${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://player.smashy.stream/tv/${tmdbId}?s=${s}&e=${e}`;
    },
  },
  {
    id: 'superembed',
    name: 'SuperEmbed',
    icon: Play,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`;
    },
  },
  {
    id: 'vidsrcme',
    name: 'VidSrc.me',
    icon: Video,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://vidsrc.me/embed/movie/${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://vidsrc.me/embed/tv/${tmdbId}/${s}/${e}`;
    },
  },
  {
    id: 'vidplay',
    name: 'VidPlay',
    icon: Tv,
    buildUrl: (type, tmdbId, season, episode) => {
      if (type === 'movie') {
        return `https://vidplay.online/embed/movie/${tmdbId}`;
      }
      const s = season || 1;
      const e = episode || 1;
      return `https://vidplay.online/embed/tv/${tmdbId}/${s}/${e}`;
    },
  },
];

const LOCAL_STORAGE_KEY = 'preferredProviderId';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ tmdbId, type, title, season, episode, episodeTitle, initialProviderId }) => {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [failedProviders, setFailedProviders] = useState<Set<ProviderId>>(new Set());
  const [loadError, setLoadError] = useState(false);
  
  const [selectedProviderId, setSelectedProviderId] = useState<ProviderId>(() => {
    if (typeof window === 'undefined') return 'torrent';
    const fromInitial = (initialProviderId as ProviderId) || null;
    const fromStorage = (window.localStorage.getItem(LOCAL_STORAGE_KEY) as ProviderId) || null;
    return (fromInitial || fromStorage || 'torrent') as ProviderId;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, selectedProviderId);
  }, [selectedProviderId]);

  const activeProvider = useMemo(() => {
    return (
      PROVIDERS.find((p) => p.id === selectedProviderId) || PROVIDERS[0]
    );
  }, [selectedProviderId]);

  const src = useMemo(() => {
    return activeProvider.buildUrl(type, tmdbId, season, episode);
  }, [activeProvider, type, tmdbId, season, episode]);

  const displayTitle = useMemo(() => {
    if (type === 'show' && season && episode) {
        const seasonStr = `S${season.toString().padStart(2, '0')}`;
        const episodeStr = `E${episode.toString().padStart(2, '0')}`;
        return `${title} - ${seasonStr}${episodeStr}${episodeTitle ? `: ${episodeTitle}` : ''}`;
    }
    return title;
  }, [title, type, season, episode, episodeTitle]);

  const tryNextProvider = useCallback(() => {
    const availableProviders = PROVIDERS.filter(p => !failedProviders.has(p.id));
    
    if (availableProviders.length === 0) {
      setLoadError(true);
      toast({
        title: "All providers failed",
        description: "Unable to load video from any source. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    const currentIndex = PROVIDERS.findIndex(p => p.id === selectedProviderId);
    let nextProvider = PROVIDERS[(currentIndex + 1) % PROVIDERS.length];
    
    // Find next available provider
    for (let i = 0; i < PROVIDERS.length; i++) {
      const idx = (currentIndex + i + 1) % PROVIDERS.length;
      if (!failedProviders.has(PROVIDERS[idx].id)) {
        nextProvider = PROVIDERS[idx];
        break;
      }
    }
    
    if (!failedProviders.has(nextProvider.id)) {
      setSelectedProviderId(nextProvider.id);
      toast({
        title: "Switching provider",
        description: `Trying ${nextProvider.name}...`,
      });
    }
  }, [selectedProviderId, failedProviders, toast]);

  // Reset error state when provider changes
  useEffect(() => {
    setLoadError(false);
  }, [selectedProviderId]);

  return (
    <div className="w-full bg-background rounded-lg overflow-hidden">
       <div className="p-3 bg-muted/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
            <MonitorPlay className="w-6 h-6 flex-shrink-0 text-primary" />
            <div className='flex-grow min-w-0'>
                <p className="text-xs text-muted-foreground">Now Playing</p>
                <p className="text-sm font-semibold truncate" title={displayTitle}>{displayTitle}</p>
            </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select value={selectedProviderId} onValueChange={(val) => setSelectedProviderId(val as ProviderId)}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center gap-2">
                    <provider.icon className="h-4 w-4" />
                    <span>{provider.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={tryNextProvider}
            title="Try next provider"
            aria-label="Try next provider"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Open current source in new tab">
            <a href={src} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
      <div className="w-full aspect-video bg-black relative">
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-center text-white p-6">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-semibold mb-2">Unable to load video</h3>
              <p className="text-sm text-white/70 mb-4">All video sources failed to load</p>
              <Button onClick={() => { setFailedProviders(new Set()); setLoadError(false); setSelectedProviderId('torrent'); }}>
                Try Again
              </Button>
            </div>
          </div>
        )}
        {!loadError && (
          <iframe
            ref={iframeRef}
            key={`${selectedProviderId}-${src}`}
            src={src}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
            allowFullScreen
            referrerPolicy="no-referrer"
            title="Video player"
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;


