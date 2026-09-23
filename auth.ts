import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    Credentials({
      id: 'credentials',
      name: 'Demo Account',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        // Demo credentials for evaluation and testing (PRO & FREE)
        // PRO Demo Account
        if (
          (email === 'demo-pro@f1telemetry.pro' ||
            email === 'demo@f1telemetry.pro' ||
            email === 'pro@f1telemetry.pro') &&
          (password === 'f1pro2026' || password === 'f1pro2024')
        ) {
          return {
            id: 'demo-pro-user-1',
            name: 'Demo Pro User',
            email: 'demo-pro@f1telemetry.pro',
            image: '/images/drivers/portraits/max-verstappen.jpg',
            role: 'pro',
          };
        }

        // FREE Demo Account
        if (
          (email === 'demo-free@f1telemetry.pro' ||
            email === 'free@f1telemetry.pro') &&
          (password === 'f1free2026' || password === 'f1free2024')
        ) {
          return {
            id: 'demo-free-user-1',
            name: 'Demo Free User',
            email: 'demo-free@f1telemetry.pro',
            image: '/images/drivers/portraits/yuki-tsunoda.jpg',
            role: 'free',
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'free';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        // Attach role to session user
        (session.user as unknown as { role: string }).role = (token.role as string) || 'free';
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || 'f1-telemetry-nextauth-secret-key-2026-padoroku-dev',
  trustHost: true,
});
