import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/auth/SessionProvider';

export const metadata: Metadata = {
  title: 'F1 Telemetry Analyzer',
  description: 'Deep-dive telemetry data analysis and AI discussion platform for Formula 1 enthusiasts.',
  keywords: ['Formula 1', 'F1', 'telemetry', 'lap times', 'race analysis'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
