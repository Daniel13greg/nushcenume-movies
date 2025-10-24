"use client";

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

/**
 * Reusable error state component
 * Displays error information with retry and home navigation options
 */
export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content',
  onRetry,
  showHomeButton = true,
}: ErrorStateProps) {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <AlertCircle className="w-8 h-8 text-destructive" />
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
