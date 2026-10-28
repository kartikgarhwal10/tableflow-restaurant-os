'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KitchenPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/kitchen/orders');
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-400 text-sm">
      Loading Kitchen Display System...
    </div>
  );
}
