'use client';

import { Info } from 'lucide-react';

export default function AdPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`relative w-full h-24 bg-muted/50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground text-sm p-4 ${className}`}
    >
      <div className="absolute top-1 right-1 flex items-center gap-1 text-xs">
        <span className="font-semibold">Ad</span>
        <Info className="w-3 h-3" />
      </div>
      <p className="font-medium">Advertisement</p>
      <p className="text-xs text-center">(This is a placeholder for an ad unit)</p>
    </div>
  );
}
