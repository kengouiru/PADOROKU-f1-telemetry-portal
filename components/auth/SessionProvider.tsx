'use client';

import React, { useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider, useSession } from 'next-auth/react';
import { setUserTier } from '@/lib/tierService';

function TierSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    // Only sync if user hasn't explicitly set a preference in localStorage
    if (session?.user) {
      const existing = typeof window !== 'undefined' ? localStorage.getItem('f1_padoroku_user_tier') : null;
      if (!existing) {
        const role = (session.user as { role?: string }).role;
        if (role === 'pro') {
          setUserTier('pro');
        } else if (role === 'free') {
          setUserTier('free');
        }
      }
    }
  }, [session]);

  return <>{children}</>;
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <TierSync>{children}</TierSync>
    </NextAuthSessionProvider>
  );
}
