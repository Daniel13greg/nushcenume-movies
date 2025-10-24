"use client"

import { MediaCarousel } from '@/components/media-carousel'
import { HeroSection } from '@/components/animations/hero-section'
import type { Media } from '@/lib/types'

interface MoviesClientProps {
  featured: Media
  popular: Media[]
  action: Media[]
  comedy: Media[]
  drama: Media[]
  horror: Media[]
  sciFi: Media[]
}

export function MoviesClient({
  featured,
  popular,
  action,
  comedy,
  drama,
  horror,
  sciFi
}: MoviesClientProps) {
  return (
    <div className="flex flex-col gap-2 pb-8">
      <HeroSection media={featured} linkPrefix="movie" />
      <div className="w-full -mt-16 md:-mt-24 relative z-20 container mx-auto">
        <MediaCarousel title="Popular Movies" media={popular} />
        <MediaCarousel title="Action" media={action} />
        <MediaCarousel title="Comedy" media={comedy} />
        <MediaCarousel title="Drama" media={drama} />
        <MediaCarousel title="Horror" media={horror} />
        <MediaCarousel title="Sci‑Fi" media={sciFi} />
      </div>
    </div>
  )
}