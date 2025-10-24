"use client"

import { MediaCarousel } from '@/components/media-carousel'
import { ContinueWatching } from '@/components/continue-watching'
import { HeroSection } from '@/components/animations/hero-section'
import type { Media } from '@/lib/types'

interface HomeClientProps {
  featured: Media
  movies: Media[]
  shows: Media[]
  actionMovies: Media[]
  comedyMovies: Media[]
  horrorMovies: Media[]
}

export function HomeClient({
  featured,
  movies,
  shows,
  actionMovies,
  comedyMovies,
  horrorMovies
}: HomeClientProps) {
  return (
    <div className="flex flex-col">
      <HeroSection media={featured} linkPrefix="movie" />
      
      <ContinueWatching />
      
      <div className="w-full -mt-16 md:-mt-24 z-20 relative container mx-auto">
        <MediaCarousel title="Popular Movies" media={movies} />
        <MediaCarousel title="Trending Shows" media={shows} />
        <MediaCarousel title="Action Movies" media={actionMovies} />
        <MediaCarousel title="Comedy Movies" media={comedyMovies} />
        <MediaCarousel title="Horror Movies" media={horrorMovies} />
      </div>
    </div>
  )
}