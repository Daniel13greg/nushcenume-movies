"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useWatchlist } from '@/context/watchlist-context'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Heart, Check, PlayCircle, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Media } from '@/lib/types'
import { useLanguage } from '@/context/language-context'
import SeasonsAccordion from '@/components/seasons-accordion'
import { getRecommendations } from '@/services/tmdb'
import { MediaCarousel } from '@/components/media-carousel'
import { TrailerDialog } from '@/components/trailer-dialog'
import { motion } from 'framer-motion'
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/animations'

const VideoPlayer = dynamic(() => import('@/components/video-player'), {
  ssr: false,
  loading: () => <Skeleton className="w-full aspect-video bg-muted" />,
})

export default function MediaDetailPage() {
  const params = useParams()
  const rawId = params.id as string
  const [mediaType, mediaId] = rawId.split('-') as ['movie' | 'show', string]
  const { language } = useLanguage()

  const [media, setMedia] = useState<Media | null>(null)
  const [recommendations, setRecommendations] = useState<Media[]>([])
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const { addToWatchlist, removeFromWatchlist, isMediaInWatchlist, addToViewed } = useWatchlist()

  useEffect(() => {
    async function fetchDetails() {
      if (!mediaId || !mediaType) return
      setLoading(true)
      try {
        const [detailsRes, trailerRes] = await Promise.all([
          fetch(`/api/media/${mediaType}/${mediaId}?language=${language}`),
          fetch(`/api/media/trailer/${mediaType}/${mediaId}`)
        ])

        const details = (await detailsRes.json()) as Media | { error: string }
        if ((details as any).error) {
          setMedia(null)
        } else {
          setMedia(details as Media)
          getRecommendations(mediaId, mediaType, language).then(setRecommendations)
        }

        const trailer = await trailerRes.json()
        setTrailerKey(trailer.key || null)
      } catch (e) {
        setMedia(null)
      }
      setLoading(false)
    }
    fetchDetails()
  }, [mediaId, mediaType, language])

  useEffect(() => {
    if(media) {
      addToViewed(rawId)
    }
  }, [media, addToViewed, rawId])

  if (loading || !media) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="min-h-screen">
          <div className="relative h-[40vh] md:h-[60vh] w-full">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative pb-16">
            <div className="md:flex gap-8">
              <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                <Skeleton className="w-full h-[450px] rounded-lg" />
              </div>
              <div className="md:w-2/3 lg:w-3/4 mt-6 md:mt-0 pt-0 md:pt-48">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-6" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const inWatchlist = isMediaInWatchlist(rawId)

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(rawId)
    } else {
      addToWatchlist(rawId)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Background Image with Animation */}
      <motion.div
        className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={media.imageUrl}
          alt={media.title}
          fill
          quality={85}
          sizes="100vw"
          className="opacity-30 object-cover"
          data-ai-hint={media['data-ai-hint']}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-48 relative pb-16">
        <div className="md:flex gap-8">
          {/* Poster with Scale Animation */}
          <motion.div
            className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={media.posterUrl}
              alt={media.title}
              width={500}
              height={750}
              quality={90}
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 20vw"
              className="rounded-lg shadow-2xl"
              data-ai-hint={media['data-ai-hint']}
            />
          </motion.div>

          {/* Content with Staggered Animations */}
          <motion.div
            className="md:w-2/3 lg:w-3/4 mt-6 md:mt-0 pt-0 md:pt-48"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              className="flex flex-wrap items-center gap-4 mb-2"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline">{media.type.toUpperCase()}</Badge>
              <span className="text-muted-foreground">{media.year}</span>
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-5xl font-extrabold tracking-tight"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              {media.title}
            </motion.h1>

            <motion.div
              className="flex flex-wrap gap-2 mt-4"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              {media.genres.map((genre, index) => (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  <Badge variant="secondary">{genre.name}</Badge>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="mt-6 text-lg text-muted-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              {media.description}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 flex-grow sm:flex-grow-0 shadow-lg shadow-primary/30">
                      <PlayCircle className="mr-2 h-5 w-5" /> Play
                    </Button>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false} className="max-w-6xl p-0 border-0">
                    <DialogTitle className="sr-only">{`Play ${media.title}`}</DialogTitle>
                    <VideoPlayer tmdbId={media.id} type={media.type} title={media.title} season={1} episode={1} />
                  </DialogContent>
                </Dialog>
              </motion.div>

              {trailerKey && (
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <TrailerDialog trailerKey={trailerKey} title={media.title} />
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" variant="outline" onClick={handleWatchlistToggle} className="flex-grow sm:flex-grow-0">
                  <motion.div
                    animate={{ rotate: inWatchlist ? 0 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {inWatchlist ? <Check className="mr-2 h-5 w-5" /> : <Heart className="mr-2 h-5 w-5" />}
                  </motion.div>
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {media.type === 'show' && media.seasons && (
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <SeasonsAccordion seasons={media.seasons} showId={media.id} showTitle={media.title} />
          </motion.div>
        )}

        {/* Cast Section with Staggered Animations */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.cast.map((actor, index) => (
              <motion.div
                key={actor.name}
                className="bg-card p-3 rounded-md text-card-foreground text-center group hover:bg-accent transition-colors duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5),
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                whileHover={{ y: -5 }}
              >
                <div className="w-24 h-24 rounded-full mx-auto mb-2 overflow-hidden bg-muted">
                  {actor.profile_path ? (
                    <Image
                      src={`${"https://image.tmdb.org/t/p"}/w185${actor.profile_path}`}
                      alt={actor.name}
                      width={96}
                      height={96}
                      quality={75}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  )}
                </div>
                <p className="font-semibold">{actor.name}</p>
                <p className="text-sm text-muted-foreground">{actor.character}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Section with Staggered Animations */}
        {media.reviews.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-6">
              {media.reviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="bg-card p-6 rounded-lg border hover:border-primary/50 transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                >
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-lg">{review.user}</h3>
                    <div className="ml-auto flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                      <span className="font-bold">{review.rating}</span>
                      <span className="text-sm text-muted-foreground">/ 5</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {recommendations.length > 0 && (
            <div className="mt-16">
                <MediaCarousel title="More Like This" media={recommendations} />
            </div>
        )}
      </div>
    </div>
  )
}