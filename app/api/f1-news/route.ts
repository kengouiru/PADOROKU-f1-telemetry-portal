import { NextResponse } from 'next/server';

/**
 * app/api/f1-news/route.ts
 * BFF route for aggregating and normalizing latest F1 news feeds.
 * Extracts: Detailed Topics, Team Badges (with official colors), and Driver 3-Letter Badges.
 */

export interface TeamTag {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type TopicTag = 'Aero' | 'PU' | 'Tyre' | 'Strategy' | 'Contract' | 'FIA';

export interface F1NewsArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  source: string;
  pubDate: string;
  category: 'TECHNICAL' | 'PADDOCK' | 'RACE' | 'FIA';
  badgeColor: string;
  topics: TopicTag[];
  teams: TeamTag[];
  drivers: string[]; // 3-letter codes: e.g. ["VER", "HAM"]
}

const TEAM_CONFIGS: Record<string, { color: string; bgColor: string; borderColor: string; keywords: string[] }> = {
  'Red Bull': {
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    keywords: ['red bull', 'verstappen', 'hadjar', 'mekies', 'marko', 'lambiase', 'レッドブル', 'ハジャー', 'メキース'],
  },
  'Ferrari': {
    color: '#f87171',
    bgColor: 'rgba(248, 113, 113, 0.15)',
    borderColor: 'rgba(248, 113, 113, 0.4)',
    keywords: ['ferrari', 'leclerc', 'hamilton', 'vasseur', 'フェラーリ', 'ルクレール', 'ハミルトン', 'バスール'],
  },
  'McLaren': {
    color: '#fb923c',
    bgColor: 'rgba(251, 146, 60, 0.15)',
    borderColor: 'rgba(251, 146, 60, 0.4)',
    keywords: ['mclaren', 'norris', 'piastri', 'stella', 'brown', 'マクラーレン', 'ノリス', 'ピアストリ'],
  },
  'Mercedes': {
    color: '#2dd4bf',
    bgColor: 'rgba(45, 212, 191, 0.15)',
    borderColor: 'rgba(45, 212, 191, 0.4)',
    keywords: ['mercedes', 'russell', 'antonelli', 'wolff', 'メルセデス', 'ラッセル', 'アントネッリ'],
  },
  'Aston Martin': {
    color: '#34d399',
    bgColor: 'rgba(52, 211, 153, 0.15)',
    borderColor: 'rgba(52, 211, 153, 0.4)',
    keywords: ['aston martin', 'alonso', 'stroll', 'newey', 'cowell', 'honda', 'アストンマーティン', 'アロンソ', 'ニューウェイ', 'ホンダ'],
  },
  'RB': {
    color: '#60a5fa',
    bgColor: 'rgba(96, 165, 250, 0.15)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
    keywords: ['racing bulls', ' rb ', 'tsunoda', 'lawson', 'permane', '角田', 'ローソン', 'パーメイン'],
  },
  'Alpine': {
    color: '#0284c7',
    bgColor: 'rgba(2, 132, 199, 0.15)',
    borderColor: 'rgba(2, 132, 199, 0.4)',
    keywords: ['alpine', 'gasly', 'colapinto', 'briatore', 'nielsen', 'アルピーヌ', 'ガスリー', 'コラピント', 'ブリアトーレ'],
  },
  'Williams': {
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    keywords: ['williams', 'albon', 'sainz', 'vowles', 'ウィリアムズ', 'アルボン', 'サインツ', 'ボウルズ'],
  },
  'Audi': {
    color: '#e0001a',
    bgColor: 'rgba(224, 0, 26, 0.15)',
    borderColor: 'rgba(224, 0, 26, 0.4)',
    keywords: ['audi', 'revolut', 'sauber', 'hulkenberg', 'bortoleto', 'binotto', 'wheatley', 'アウディ', 'ザウバー', 'ヒュルケンベルグ', 'ボルトレート', 'ビノット'],
  },
  'Haas': {
    color: '#e2e8f0',
    bgColor: 'rgba(226, 232, 240, 0.15)',
    borderColor: 'rgba(226, 232, 240, 0.4)',
    keywords: ['haas', 'ocon', 'bearman', 'komatsu', 'ハース', 'オコン', 'ベアマン', '小松'],
  },
  'Cadillac': {
    color: '#D4AF37',
    bgColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    keywords: ['cadillac', 'perez', 'bottas', 'budkowski', 'general motors', 'キャデラック', 'ペレス', 'ボッタス', 'バドコウスキー'],
  },
};

const DRIVER_MAP: Record<string, string[]> = {
  'VER': ['verstappen', 'max verstappen', 'マックス', 'フェルスタッペン'],
  'HAD': ['hadjar', 'isack hadjar', 'ハジャー'],
  'HAM': ['hamilton', 'lewis hamilton', 'ハミルトン'],
  'LEC': ['leclerc', 'charles leclerc', 'ルクレール'],
  'NOR': ['norris', 'lando norris', 'ノリス'],
  'PIA': ['piastri', 'oscar piastri', 'ピアストリ'],
  'RUS': ['russell', 'george russell', 'ラッセル'],
  'ANT': ['antonelli', 'kimi antonelli', 'アントネッリ'],
  'ALO': ['alonso', 'fernando alonso', 'アロンソ'],
  'STR': ['stroll', 'lance stroll', 'ストロール'],
  'GAS': ['gasly', 'pierre gasly', 'ガスリー'],
  'COL': ['colapinto', 'franco colapinto', 'コラピント'],
  'ALB': ['albon', 'alex albon', 'アルボン'],
  'SAI': ['sainz', 'carlos sainz', 'サインツ'],
  'TSU': ['tsunoda', 'yuki tsunoda', '角田', '角田裕毅'],
  'LAW': ['lawson', 'liam lawson', 'ローソン'],
  'HUL': ['hulkenberg', 'nico hulkenberg', 'ヒュルケンベルグ'],
  'BOR': ['bortoleto', 'gabriel bortoleto', 'ボルトレート'],
  'OCO': ['ocon', 'esteban ocon', 'オコン'],
  'BEA': ['bearman', 'oliver bearman', 'ベアマン'],
  'PER': ['perez', 'sergio perez', 'ペレス'],
  'BOT': ['bottas', 'valtteri bottas', 'ボッタス'],
};

// Tag extractors
function extractTopics(title: string, summary: string): TopicTag[] {
  const text = `${title} ${summary}`.toLowerCase();
  const topics: TopicTag[] = [];

  if (text.includes('floor') || text.includes('wing') || text.includes('downforce') || text.includes('diffuser') || text.includes('aero') || text.includes('porpoising') || text.includes('空力') || text.includes('フロア') || text.includes('ウイング')) {
    topics.push('Aero');
  }
  if (text.includes('engine') || text.includes('pu') || text.includes('power unit') || text.includes('ers') || text.includes('mgu') || text.includes('turbo') || text.includes('reliability') || text.includes('エンジン') || text.includes('パワーユニット')) {
    topics.push('PU');
  }
  if (text.includes('tyre') || text.includes('tire') || text.includes('pirelli') || text.includes('compound') || text.includes('degradation') || text.includes('wear') || text.includes('graining') || text.includes('タイヤ') || text.includes('ピレリ') || text.includes('デグラデーション')) {
    topics.push('Tyre');
  }
  if (text.includes('strategy') || text.includes('pit') || text.includes('undercut') || text.includes('overcut') || text.includes('stint') || text.includes('box') || text.includes('戦略') || text.includes('ピット') || text.includes('アンダーカット')) {
    topics.push('Strategy');
  }
  if (text.includes('contract') || text.includes('market') || text.includes('sign') || text.includes('seat') || text.includes('hire') || text.includes('transfer') || text.includes('replacement') || text.includes('rumour') || text.includes('移籍') || text.includes('契約') || text.includes('シート')) {
    topics.push('Contract');
  }
  if (text.includes('fia') || text.includes('penalty') || text.includes('steward') || text.includes('rule') || text.includes('regulation') || text.includes('investigation') || text.includes('track limit') || text.includes('裁定') || text.includes('ペナルティ') || text.includes('規則')) {
    topics.push('FIA');
  }

  return topics.length > 0 ? topics : ['Aero'];
}

function extractTeams(title: string, summary: string): TeamTag[] {
  const text = `${title} ${summary}`.toLowerCase();
  const teams: TeamTag[] = [];

  for (const [teamName, config] of Object.entries(TEAM_CONFIGS)) {
    const matches = config.keywords.some((kw) => text.includes(kw));
    if (matches) {
      teams.push({
        name: teamName,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
      });
    }
  }

  return teams;
}

function extractDrivers(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const drivers: string[] = [];

  for (const [code, keywords] of Object.entries(DRIVER_MAP)) {
    const matches = keywords.some((kw) => text.includes(kw));
    if (matches) {
      drivers.push(code);
    }
  }

  return drivers;
}

const FALLBACK_NEWS: F1NewsArticle[] = [
  {
    id: 'fb-1',
    title: 'レッドブル、次戦に向けてフロア下部ベンチュリトンネルの大規模アップデートを投入',
    summary: '高速コーナーでのダウンフォース安定性とポーパシング抑制を目指し、アンダーフロア前端のインレット形状およびエッジウィングの気流制御構造を一新した新パッケージを導入。フェルスタッペンのフィードバックを反映。',
    link: 'https://www.formula1.com/en/latest/article.technical-updates.html',
    source: 'Formula1.com Technical',
    pubDate: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    category: 'TECHNICAL',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    topics: ['Aero', 'Strategy'],
    teams: [{ name: 'Red Bull', color: '#38bdf8', bgColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)' }],
    drivers: ['VER'],
  },
  {
    id: 'fb-2',
    title: 'フェラーリ、ロングランでのリアタイヤ発熱を抑えるサスペンションジオメトリ改良を実施',
    summary: '第2スティント以降のハードタイヤにおける熱ダレを抑制するため、リアサスペンションのアンチスクワット角とキャンバー変化率を再最適化。ルクレールとサインツがテスト。',
    link: 'https://www.motorsport.com/f1/news/ferrari-tyre-degradation-setup/',
    source: 'Motorsport.com',
    pubDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    category: 'TECHNICAL',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    topics: ['Tyre', 'Aero'],
    teams: [{ name: 'Ferrari', color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.15)', borderColor: 'rgba(248, 113, 113, 0.4)' }],
    drivers: ['LEC', 'SAI'],
  },
  {
    id: 'fb-3',
    title: 'マクラーレン、ノリスとピアストリのタイトル争いを支える新型Hウィングを公開',
    summary: '高速サーキットでの直線スピードとDRS効率を両立させる新型リヤウィングを投入。低ドラッグ特性によりトップスピード向上を狙う。',
    link: 'https://www.motorsport.com/f1/news/mclaren-rear-wing-update/',
    source: 'Motorsport.com Live',
    pubDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    category: 'TECHNICAL',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    topics: ['Aero'],
    teams: [{ name: 'McLaren', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.15)', borderColor: 'rgba(251, 146, 60, 0.4)' }],
    drivers: ['NOR', 'PIA'],
  },
  {
    id: 'fb-4',
    title: 'パドック速報：2025年ドライバー市場とパワーユニット供給契約を巡る最新の動き',
    summary: 'ハミルトンの移籍に伴うメルセデスのシート争いに加え、角田裕毅とレッドブル昇格シナリオに関する議論が本格化。',
    link: 'https://www.formula1.com/en/latest/article.driver-market-rumours.html',
    source: 'Paddock Insider',
    pubDate: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    category: 'PADDOCK',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    topics: ['Contract', 'PU'],
    teams: [
      { name: 'Mercedes', color: '#2dd4bf', bgColor: 'rgba(45, 212, 191, 0.15)', borderColor: 'rgba(45, 212, 191, 0.4)' },
      { name: 'Red Bull', color: '#38bdf8', bgColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)' },
      { name: 'RB', color: '#60a5fa', bgColor: 'rgba(96, 165, 250, 0.15)', borderColor: 'rgba(96, 165, 250, 0.4)' },
    ],
    drivers: ['HAM', 'TSU', 'RUS'],
  },
  {
    id: 'fb-5',
    title: 'FIA、トラックリミット審理を高速化する新型高精度AIビジョンカメラを公式導入',
    summary: '白線踏み越えの自動判定システムを強化し、レースディレクターへの警告伝達を数秒以内に短縮。審理遅延によるペナルティ混乱を防ぐ。',
    link: 'https://www.fia.com/news/fia-formula-1-regulations-track-limits',
    source: 'FIA Official',
    pubDate: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    category: 'FIA',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    topics: ['FIA'],
    teams: [],
    drivers: [],
  },
  {
    id: 'fb-6',
    title: '決勝レース戦略展望：路面温度の低下とアンダーカット威力が鍵を握る2ストップ戦',
    summary: 'ナイトセッションでのトラックエボリューション（路面グリップ向上）を考慮し、ピレリ推奨のソフトからハードへの乗り換えタイミングが勝敗の分岐点に。',
    link: 'https://www.formula1.com/en/latest/article.strategy-guide.html',
    source: 'F1 Strategy Desk',
    pubDate: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    category: 'RACE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    topics: ['Strategy', 'Tyre'],
    teams: [],
    drivers: ['VER', 'NOR', 'LEC'],
  },
];

function inferCategory(title: string, desc: string): 'TECHNICAL' | 'PADDOCK' | 'RACE' | 'FIA' {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('fia') || text.includes('penalty') || text.includes('rule') || text.includes('steward') || text.includes('track limit')) {
    return 'FIA';
  }
  if (text.includes('upgrade') || text.includes('wing') || text.includes('floor') || text.includes('engine') || text.includes('aero') || text.includes('tyre') || text.includes('brake')) {
    return 'TECHNICAL';
  }
  if (text.includes('rumour') || text.includes('contract') || text.includes('driver') || text.includes('market') || text.includes('paddock') || text.includes('hire') || text.includes('boss')) {
    return 'PADDOCK';
  }
  return 'RACE';
}

function getBadgeColor(cat: string): string {
  switch (cat) {
    case 'TECHNICAL': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'PADDOCK': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'FIA': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  }
}

export async function GET() {
  try {
    const feedUrls = ['https://www.motorsport.com/rss/f1/news/'];
    let liveArticles: F1NewsArticle[] = [];

    for (const url of feedUrls) {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(8000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; F1TelemetryNewsAggregator/1.0)',
            Accept: 'application/rss+xml, application/xml, text/xml',
          },
          next: { revalidate: 1800 },
        });

        if (res.ok) {
          const xmlText = await res.text();
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          let match;
          let count = 0;

          while ((match = itemRegex.exec(xmlText)) !== null && count < 10) {
            const itemContent = match[1];
            const titleMatch = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(itemContent);
            const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
            const descMatch = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/.exec(itemContent);
            const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);

            const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
            const link = linkMatch ? linkMatch[1].trim() : '';
            let rawDesc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
            if (rawDesc.length > 220) rawDesc = rawDesc.slice(0, 217) + '...';

            if (title && link) {
              const cat = inferCategory(title, rawDesc);
              const topics = extractTopics(title, rawDesc);
              const teams = extractTeams(title, rawDesc);
              const drivers = extractDrivers(title, rawDesc);

              liveArticles.push({
                id: `rss-${count}-${Date.now()}`,
                title,
                summary: rawDesc || title,
                link,
                source: 'Motorsport.com Live',
                pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                category: cat,
                badgeColor: getBadgeColor(cat),
                topics,
                teams,
                drivers,
              });
              count++;
            }
          }
        }
      } catch (feedErr) {
        console.warn(`[News RSS Feed Error for ${url}]:`, feedErr);
      }
    }

    const mergedNews = liveArticles.length > 0 ? [...liveArticles, ...FALLBACK_NEWS.slice(2)] : FALLBACK_NEWS;

    return NextResponse.json({
      articles: mergedNews,
      lastUpdated: new Date().toISOString(),
      sourceCount: mergedNews.length,
    });
  } catch (error) {
    console.error('[F1 News API Error]:', error);
    return NextResponse.json({
      articles: FALLBACK_NEWS,
      lastUpdated: new Date().toISOString(),
      isFallback: true,
    });
  }
}
