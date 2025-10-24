"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';
import { useState } from 'react';

interface TrailerDialogProps {
  trailerKey: string;
  title: string;
}

export function TrailerDialog({ trailerKey, title }: TrailerDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="flex-grow sm:flex-grow-0">
          <Film className="mr-2 h-5 w-5" />
          Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl p-0 border-0" showCloseButton={true}>
        <DialogTitle className="sr-only">{`${title} - Trailer`}</DialogTitle>
        <div className="aspect-video w-full bg-black">
          {open && (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${title} Trailer`}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}