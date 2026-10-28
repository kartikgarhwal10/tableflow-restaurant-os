'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/staff/floor');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
      Loading Waiter Portal...
    </div>
  );
}
