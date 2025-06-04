'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-yellow-400 animate-spin" />
        <p className="mt-4 text-white text-lg">Loading...</p>
      </div>
    </div>
  );
}
