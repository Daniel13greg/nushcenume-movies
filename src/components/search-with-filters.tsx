"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MediaCard } from '@/components/media-card';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import type { Media } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/animations';

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' },
];

const YEARS = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i).map(String);

export function SearchWithFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>(searchParams.get('type') || 'all');
  const [genre, setGenre] = useState<string>(searchParams.get('genre') || 'all');
  const [year, setYear] = useState<string>(searchParams.get('year') || 'all');
  const [rating, setRating] = useState<string>(searchParams.get('rating') || 'all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'popularity');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query });
        if (type !== 'all') params.set('type', type);
        if (genre !== 'all') params.set('genre', genre);
        if (year !== 'all') params.set('year', year);
        if (rating !== 'all') params.set('rating', rating);
        params.set('sort', sortBy);
        
        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        setResults(data);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type, genre, year, rating, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setType('all');
    setGenre('all');
    setYear('all');
    setRating('all');
    setSortBy('popularity');
    router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
  };

  const activeFiltersCount = [type, genre, year, rating].filter(v => v !== 'all').length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with animations */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-3xl font-bold">
          {query ? `Search Results for "${query}"` : 'Search'}
        </h1>
        
        <Sheet>
          <SheetTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="default">
                      {activeFiltersCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Results</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => { setType(v); updateFilter('type', v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="movie">Movies</SelectItem>
                    <SelectItem value="show">TV Shows</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Genre</Label>
                <Select value={genre} onValueChange={(v) => { setGenre(v); updateFilter('genre', v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {GENRES.map(g => (
                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={(v) => { setYear(v); updateFilter('year', v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {YEARS.map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Select value={rating} onValueChange={(v) => { setRating(v); updateFilter('rating', v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Rating</SelectItem>
                    <SelectItem value="7">7+ ⭐</SelectItem>
                    <SelectItem value="8">8+ ⭐⭐</SelectItem>
                    <SelectItem value="9">9+ ⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); updateFilter('sort', v); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="release_date">Release Date</SelectItem>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline" className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>

      {/* Active Filter Badges with animations */}
      <AnimatePresence mode="wait">
        {activeFiltersCount > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {type !== 'all' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  {type === 'movie' ? 'Movies' : 'TV Shows'}
                  <X className="ml-1 h-3 w-3" onClick={() => { setType('all'); updateFilter('type', 'all'); }} />
                </Badge>
              </motion.div>
            )}
            {genre !== 'all' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.05 }}
              >
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  {GENRES.find(g => g.id === genre)?.name}
                  <X className="ml-1 h-3 w-3" onClick={() => { setGenre('all'); updateFilter('genre', 'all'); }} />
                </Badge>
              </motion.div>
            )}
            {year !== 'all' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
              >
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  {year}
                  <X className="ml-1 h-3 w-3" onClick={() => { setYear('all'); updateFilter('year', 'all'); }} />
                </Badge>
              </motion.div>
            )}
            {rating !== 'all' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.15 }}
              >
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">
                  {rating}+ ⭐
                  <X className="ml-1 h-3 w-3" onClick={() => { setRating('all'); updateFilter('rating', 'all'); }} />
                </Badge>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Results Section with animations */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="aspect-[2/3] bg-muted animate-pulse rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              />
            ))}
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div
            key="results"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {results.map((media, index) => (
              <motion.div
                key={`${media.type}-${media.id}`}
                className="aspect-[2/3]"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.6),
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <MediaCard media={media} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          query && (
            <motion.div
              key="no-results"
              className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg border-2 border-dashed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <SearchIcon className="w-16 h-16 text-muted-foreground mb-4" />
              </motion.div>
              <motion.h2
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                No results found for &quot;{query}&quot;
              </motion.h2>
              <motion.p
                className="text-muted-foreground mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Try adjusting your filters or search terms.
              </motion.p>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}