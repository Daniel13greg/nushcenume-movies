"use client"

import { MediaCarousel } from '@/components/media-carousel'
import { HeroSection } from '@/components/animations/hero-section'
import type { Media } from '@/lib/types'

interface ShowsClientProps {
  featured: Media
  popular: Media[]
  topRated: Media[]
  airingToday: Media[]
  trending: Media[]
  drama: Media[]
  comedy: Media[]
  actionAdventure: Media[]
  mystery: Media[]
  crime: Media[]
  scifi: Media[]
}

export function ShowsClient({
  featured,
  popular,
  topRated,
  airingToday,
  trending,
  drama,
  comedy,
  actionAdventure,
  mystery,
  crime,
  scifi
}: ShowsClientProps) {
  return (
    <div className="flex flex-col gap-2 pb-8">
      <HeroSection media={featured} linkPrefix="show" />
      <div className="w-full -mt-16 md:-mt-24 relative z-20 container mx-auto">
        <MediaCarousel title="Trending Today" media={trending} />
        <MediaCarousel title="Popular Shows" media={popular} />
        <MediaCarousel title="Top Rated" media={topRated} />
        <MediaCarousel title="Airing Today" media={airingToday} />
        <MediaCarousel title="Drama" media={drama} />
        <MediaCarousel title="Comedy" media={comedy} />
        <MediaCarousel title="Action & Adventure" media={actionAdventure} />
        <MediaCarousel title="Mystery" media={mystery} />
        <MediaCarousel title="Crime" media={crime} />
        <MediaCarousel title="Sci‑Fi & Fantasy" media={scifi} />
      </div>
    </div>
  )
}