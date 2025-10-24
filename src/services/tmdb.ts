'use server';

import type {
  Media,
  TmdbMovie,
  TmdbShow,
  TmdbMovieDetails,
  TmdbShowDetails,
  Episode,
} from '@/lib/types';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Removed torrent placeholders and usage

const LANG_MAP: Record<string, string> = {
    en: 'en-US',
    ro: 'ro-RO',
}

const PLACEHOLDER_BACKDROP = 'https://placehold.co/1280x720';
const PLACEHOLDER_POSTER = 'https://placehold.co/500x750';

function createPlaceholderMedia(id: number, type: 'movie' | 'show'): Media {
  return {
    id,
    title: type === 'movie' ? `Placeholder Movie ${id}` : `Placeholder Show ${id}`,
    type,
    description:
      'Sample description. Add a TMDB_API_KEY in .env.local to load real content.',
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
    ],
    year: 2024,
    cast: [],
    reviews: [],
    imageUrl: PLACEHOLDER_BACKDROP,
    posterUrl: PLACEHOLDER_POSTER,
    'data-ai-hint': type === 'movie' ? 'movie poster' : 'tv show poster',
  };
}

function createPlaceholderList(count: number, type: 'movie' | 'show'): Media[] {
  return Array.from({ length: count }).map((_, i) => createPlaceholderMedia(i + 1, type));
}

async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}, language: string = 'en') {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('api_key', API_KEY!);
  url.searchParams.append('language', LANG_MAP[language] || 'en-US');

  for (const key in params) {
    url.searchParams.append(key, params[key]);
  }

  const response = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Revalidate every hour
  if (!response.ok) {
    throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
  }
  return response.json();
}

function tmdbMovieToMedia(movie: TmdbMovie): Media {
    return {
        id: movie.id,
        title: movie.title,
        type: 'movie',
        description: movie.overview,
        genres: movie.genre_ids.map(id => ({ id, name: '' })), // Genre names would need another API call or a mapping
        year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0,
        popularity: (movie as any).popularity ?? undefined,
        rating: (movie as any).vote_average ?? undefined,
        cast: [],
        reviews: [],
        imageUrl: movie.backdrop_path ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}` : `https://placehold.co/1280x720`,
        posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}/original${movie.poster_path}` : `https://placehold.co/500x750`,
        'data-ai-hint': 'movie poster',
    };
}

function tmdbShowToMedia(show: TmdbShow): Media {
    return {
        id: show.id,
        title: show.name,
        type: 'show',
        description: show.overview,
        genres: show.genre_ids.map(id => ({ id, name: '' })),
        year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : 0,
        popularity: (show as any).popularity ?? undefined,
        rating: (show as any).vote_average ?? undefined,
        cast: [],
        reviews: [],
        imageUrl: show.backdrop_path ? `${IMAGE_BASE_URL}/original${show.backdrop_path}` : `https://placehold.co/1280x720`,
        posterUrl: show.poster_path ? `${IMAGE_BASE_URL}/original${show.poster_path}` : `https://placehold.co/500x750`,
        'data-ai-hint': 'tv show poster',
    };
}


function tmdbMovieDetailsToMedia(details: TmdbMovieDetails): Media {
  return {
    id: details.id,
    title: details.title,
    type: 'movie',
    description: details.overview,
    genres: details.genres,
    year: details.release_date ? parseInt(details.release_date.split('-')[0]) : 0,
    popularity: (details as any).popularity ?? undefined,
    rating: (details as any).vote_average ?? undefined,
    cast: details.credits.cast.slice(0, 10),
    reviews: [], // TMDB API v3 doesn't easily provide user reviews in the main details endpoint
    imageUrl: details.backdrop_path ? `${IMAGE_BASE_URL}/original${details.backdrop_path}` : `https://placehold.co/1280x720`,
    posterUrl: details.poster_path ? `${IMAGE_BASE_URL}/original${details.posters_path}` : `https://placehold.co/500x750`,
    'data-ai-hint': 'movie poster',
  };
}

function tmdbShowDetailsToMedia(details: TmdbShowDetails): Media {
  return {
    id: details.id,
    title: details.name,
    type: 'show',
    description: details.overview,
    genres: details.genres,
    year: details.first_air_date ? parseInt(details.first_air_date.split('-')[0]) : 0,
    popularity: (details as any).popularity ?? undefined,
    rating: (details as any).vote_average ?? undefined,
    cast: details.credits.cast.slice(0, 10),
    reviews: [],
    imageUrl: details.backdrop_path ? `${IMAGE_BASE_URL}/original${details.backdrop_path}` : `https://placehold.co/1280x720`,
    posterUrl: details.poster_path ? `${IMAGE_BASE_URL}/original${details.poster_path}` : `https://placehold.co/500x750`,
    'data-ai-hint': 'tv show poster',
    seasons: details.seasons,
  };
}


export async function getRecommendations(id: string, type: 'movie' | 'show', language: string = 'en'): Promise<Media[]> {
    if (!API_KEY) {
        return createPlaceholderList(12, type);
    }
    const endpointType = type === 'movie' ? 'movie' : 'tv';
    const data = await fetchFromTmdb(`${endpointType}/${id}/recommendations`, {}, language);
    if (type === 'movie') {
        return data.results.map(tmdbMovieToMedia);
    } else {
        return data.results.map(tmdbShowToMedia);
    }
}

export async function getPopularMovies(language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'movie');
  }
  const data = await fetchFromTmdb('movie/popular', {}, language);
  return data.results.map(tmdbMovieToMedia);
}

export async function getPopularShows(language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'show');
  }
  const data = await fetchFromTmdb('tv/popular', {}, language);
  return data.results.map(tmdbShowToMedia);
}

export async function getTopRatedShows(language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'show');
  }
  const data = await fetchFromTmdb('tv/top_rated', {}, language);
  return data.results.map(tmdbShowToMedia);
}

export async function getAiringTodayShows(language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'show');
  }
  const data = await fetchFromTmdb('tv/airing_today', {}, language);
  return data.results.map(tmdbShowToMedia);
}

export async function getTrendingShows(language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'show');
  }
  const data = await fetchFromTmdb('trending/tv/day', {}, language);
  return data.results.map(tmdbShowToMedia);
}

export async function getShowsByGenre(genreId: string, language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'show');
  }
  const data = await fetchFromTmdb('discover/tv', { with_genres: genreId, sort_by: 'popularity.desc' }, language);
  return data.results.map(tmdbShowToMedia);
}

export async function getMoviesByGenre(genreId: string, language: string = 'en'): Promise<Media[]> {
  if (!API_KEY) {
    return createPlaceholderList(12, 'movie');
  }
  const data = await fetchFromTmdb('discover/movie', { with_genres: genreId, sort_by: 'popularity.desc' }, language);
  return data.results.map(tmdbMovieToMedia);
}

export async function getMediaDetails(id: string, type: 'movie' | 'show', language: string = 'en'): Promise<Media | null> {
  try {
    if (!API_KEY) {
      return createPlaceholderMedia(parseInt(id, 10) || 1, type);
    }
    const endpointType = type === 'movie' ? 'movie' : 'tv';
    const details = await fetchFromTmdb(`${endpointType}/${id}`, { append_to_response: 'credits,videos' }, language);
    if (type === 'movie') {
      return tmdbMovieDetailsToMedia(details as TmdbMovieDetails);
    } else {
      return tmdbShowDetailsToMedia(details as TmdbShowDetails);
    }
  } catch (error) {
    console.error(`Error fetching details for ${type} ${id}:`, error);
    return null;
  }
}

export async function getTrailer(id: string, type: 'movie' | 'show'): Promise<string | null> {
  try {
    if (!API_KEY) {
      return null;
    }
    const endpointType = type === 'movie' ? 'movie' : 'tv';
    const data = await fetchFromTmdb(`${endpointType}/${id}/videos`);
    const videos = data.results as Array<{ key: string; type: string; site: string; official: boolean }>;
    
    // Find official trailer on YouTube
    const trailer = videos.find(v => 
      v.site === 'YouTube' && 
      v.type === 'Trailer' && 
      v.official
    ) || videos.find(v => 
      v.site === 'YouTube' && 
      v.type === 'Trailer'
    ) || videos.find(v => 
      v.site === 'YouTube'
    );
    
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error(`Error fetching trailer for ${type} ${id}:`, error);
    return null;
  }
}

export async function getExternalIds(id: string, type: 'movie' | 'show'): Promise<{ imdb_id?: string } | null> {
  try {
    if (!API_KEY) {
      return null;
    }
    const endpointType = type === 'movie' ? 'movie' : 'tv';
    const data = await fetchFromTmdb(`${endpointType}/${id}/external_ids`);
    return { imdb_id: (data as any).imdb_id || undefined };
  } catch (error) {
    console.error(`Error fetching external IDs for ${type} ${id}:`, error);
    return null;
  }
}

export async function getSeasonDetails(showId: string, seasonNumber: number, language: string = 'en'): Promise<Episode[]> {
  try {
    if (!API_KEY) {
      return [];
    }
    const data = await fetchFromTmdb(`tv/${showId}/season/${seasonNumber}`, {}, language);
    return data.episodes as Episode[];
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} for show ${showId}:`, error);
    return [];
  }
}

export async function searchMedia(query: string, language: string = 'en'): Promise<Media[]> {
    try {
        if (!API_KEY) {
            const movies = createPlaceholderList(6, 'movie');
            const shows = createPlaceholderList(6, 'show');
            return [...movies, ...shows];
        }
        const [movieData, showData] = await Promise.all([
            fetchFromTmdb('search/movie', { query }, language),
            fetchFromTmdb('search/tv', { query }, language)
        ]);

        const movies = movieData.results.map(tmdbMovieToMedia);
        const shows = showData.results.map(tmdbShowToMedia);
        
        return [...movies, ...shows].sort((a,b) => (b.popularity || 0) - (a.popularity || 0));

    } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
        return [];
    }
}