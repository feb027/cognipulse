'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FleetDriversRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/fleet');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black flex items-center justify-center text-zinc-500 text-xs font-mono">
      Mengalihkan ke Konsol Armada Travel...
    </div>
  );
}
