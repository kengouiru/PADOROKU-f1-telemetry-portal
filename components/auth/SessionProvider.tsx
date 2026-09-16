'use client';

import React, { useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider, useSession } from 'next-auth/react';
import { setUserTier } from '@/lib/tierService';

function TierSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as { role?: string }).role;
      if (role === 'pro') {
        setUserTier('pro');
      } else if (role === 'free') {
        setUserTier('free');
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
