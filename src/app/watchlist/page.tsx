"use client"

import { useWatchlist } from '@/context/watchlist-context'
import { useState, useEffect } from 'react'
import type { Media } from '@/lib/types'
import { MediaCard } from '@/components/media-card'
import { Heart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/context/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer } from '@/lib/animations'

export default function WatchlistPage() {
  const { watchlist } = useWatchlist()
  const { language } = useLanguage()
  const [watchlistItems, setWatchlistItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWatchlistItems() {
      setLoading(true)
      const items = await Promise.all(
        watchlist.map(async (id) => {
          const [type, mediaId] = id.split('-') as ['movie' | 'show', string]
          try {
            const res = await fetch(`/api/media/${type}/${mediaId}?language=${language}`)
            const details = await res.json()
            return details as Media | null
          } catch (e) {
            return null
          }
        })
      )
      setWatchlistItems(items.filter((item): item is Media => !!item))
      setLoading(false)
    }

    if (watchlist.length > 0) {
      fetchWatchlistItems()
    } else {
      setLoading(false)
      setWatchlistItems([])
    }
  }, [watchlist, language])

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          My Watchlist
        </motion.h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Skeleton className="w-full h-[300px] rounded-lg" />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title with animation */}
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        My Watchlist
      </motion.h1>

      {/* Content with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {watchlistItems.length > 0 ? (
          <motion.div
            key="watchlist-items"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            initial="initial"
            animate="animate"
            exit={{ opacity: 0 }}
            variants={staggerContainer}
          >
            {watchlistItems.map((media, index) => (
              <motion.div
                key={`${media.type}-${media.id}`}
                className="aspect-[2/3]"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.6),
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <MediaCard media={media} onWatchlistPage={true} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
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
              <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            </motion.div>
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Your Watchlist is Empty
            </motion.h2>
            <motion.p
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Add movies and shows to your watchlist to see them here.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}