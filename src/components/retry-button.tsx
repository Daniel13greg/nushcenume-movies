"use client";

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  text?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Button component with retry functionality and loading state
 */
export function RetryButton({ 
  onRetry, 
  text = 'Retry', 
  size = 'default',
  variant = 'default' 
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button
      onClick={handleRetry}
      disabled={isRetrying}
      size={size}
      variant={variant}
      className="gap-2"
    >
      <motion.div
        animate={isRetrying ? { rotate: 360 } : { rotate: 0 }}
        transition={isRetrying ? {
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        } : {}}
      >
        <RefreshCw className="w-4 h-4" />
      </motion.div>
      {isRetrying ? 'Retrying...' : text}
    </Button>
  );
}
