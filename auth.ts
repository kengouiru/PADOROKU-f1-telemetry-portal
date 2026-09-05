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

        // Test demo credentials
        if (email === 'demo@f1telemetry.pro' && password === 'f1pro2024') {
          return {
            id: 'demo-pro-user-1',
            name: 'Demo Pro User',
            email: 'demo@f1telemetry.pro',
            image: '/images/drivers/portraits/max-verstappen.jpg',
            role: 'pro',
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
        token.role = (user as { role?: string }).role || 'pro';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        // Attach role to session user
        (session.user as unknown as { role: string }).role = (token.role as string) || 'pro';
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || 'f1-telemetry-nextauth-secret-key-2024-v1-dev',
  trustHost: true,
});
