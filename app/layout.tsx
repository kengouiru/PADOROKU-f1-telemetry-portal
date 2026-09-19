import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/auth/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  weight: ['500', '700', '900'],
});

export const viewport: Viewport = {
  themeColor: '#e10600',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://padoroku.app'),
  title: 'PADOROKU - F1テレメトリー & 総合大百科ポータル',
  description: 'リアルタイムF1テレメトリー比較、2026年レースカレンダー、24サーキット完全攻略、伝説のチーム無線アーカイブ、対話型F1クイズを統合した最高峰のF1エンタメ・データプラットフォーム。',
  keywords: [
    'Formula 1',
    'F1',
    'テレメトリー',
    'テレメトリー分析',
    'F1カレンダー',
    'F1 2026',
    '角田裕毅',
    'フェルスタッペン',
    'チーム無線',
    'F1クイズ',
    'サーキット解説',
    'F1歴史',
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'PADOROKU - F1テレメトリー & 総合大百科ポータル',
    description: 'リアルタイムF1テレメトリー比較、2026年全24戦レースカレンダー、サーキット完全攻略、チーム無線アーカイブ、対話型F1クイズ。',
    url: 'https://padoroku.app',
    siteName: 'PADOROKU',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PADOROKU - F1テレメトリー & 総合大百科ポータル',
    description: 'リアルタイムF1テレメトリー比較、2026年全24戦レースカレンダー、サーキット完全攻略、チーム無線アーカイブ、対話型F1クイズ。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} bg-slate-950 text-slate-100 antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
