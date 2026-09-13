import { NextResponse } from 'next/server';

/**
 * app/api/f1-news/route.ts
 * BFF route for aggregating and normalizing latest F1 news feeds.
 * Extracts: Detailed Topics, Team Badges, Driver Badges, and Primary Source Authority Levels.
 */

export interface TeamTag {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type TopicTag = 'Aero' | 'PU' | 'Tyre' | 'Strategy' | 'Contract' | 'FIA';

export type NewsAuthorityLevel = 'FIA_OFFICIAL' | 'CONSTRUCTOR_OFFICIAL' | 'BROADCAST_PRIMARY' | 'PADDOCK_INTEL';

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
  authorityLevel?: NewsAuthorityLevel;
}

const TEAM_CONFIGS: Record<string, { color: string; bgColor: string; borderColor: string; keywords: string[] }> = {
  'Red Bull': {
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    keywords: ['red bull', 'verstappen', 'hadjar', 'mekies', 'marko', 'lambiase', 'レッドブル', 'ハジャー', 'メキース', 'フォード', 'ford'],
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
  VER: ['verstappen', 'max', 'フェルスタッペン'],
  NOR: ['norris', 'lando', 'ノリス'],
  LEC: ['leclerc', 'charles', 'ルクレール'],
  PIA: ['piastri', 'oscar', 'ピアストリ'],
  SAI: ['sainz', 'carlos', 'サインツ'],
  HAM: ['hamilton', 'lewis', 'ハミルトン'],
  RUS: ['russell', 'george', 'ラッセル'],
  PER: ['perez', 'sergio', 'checo', 'ペレス'],
  ALO: ['alonso', 'fernando', 'アロンソ'],
  TSU: ['tsunoda', 'yuki', '角田'],
  ALB: ['albon', 'alex', 'アルボン'],
  HUL: ['hulkenberg', 'nico', 'ヒュルケンベルグ'],
  GAS: ['gasly', 'pierre', 'ガスリー'],
  OCO: ['ocon', 'esteban', 'オコン'],
  STR: ['stroll', 'lance', 'ストロール'],
  BEA: ['bearman', 'oliver', 'ベアマン'],
  ANT: ['antonelli', 'kimi', 'アントネッリ'],
  HAD: ['hadjar', 'isack', 'ハジャー'],
  BOR: ['bortoleto', 'gabriel', 'ボルトレート'],
  LAW: ['lawson', 'liam', 'ローソン'],
  BOT: ['bottas', 'valtteri', 'ボッタス'],
};

function extractTopics(title: string, summary: string): TopicTag[] {
  const text = `${title} ${summary}`.toLowerCase();
  const topics: TopicTag[] = [];

  if (text.includes('aero') || text.includes('wing') || text.includes('floor') || text.includes('downforce') || text.includes('drag') || text.includes('空力') || text.includes('ウィング') || text.includes('フロア')) {
    topics.push('Aero');
  }
  if (text.includes('engine') || text.includes('power unit') || text.includes('pu') || text.includes('hybrid') || text.includes('mgu') || text.includes('エンジン') || text.includes('パワーユニット') || text.includes('ホンダ') || text.includes('honda')) {
    topics.push('PU');
  }
  if (text.includes('tyre') || text.includes('tire') || text.includes('pirelli') || text.includes('compound') || text.includes('degradation') || text.includes('タイヤ') || text.includes('ピレリ') || text.includes('デグラ')) {
    topics.push('Tyre');
  }
  if (text.includes('strategy') || text.includes('pit') || text.includes('undercut') || text.includes('overcut') || text.includes('stint') || text.includes('戦略') || text.includes('ピット') || text.includes('アンダーカット')) {
    topics.push('Strategy');
  }
  if (text.includes('contract') || text.includes('market') || text.includes('seat') || text.includes('transfer') || text.includes('sign') || text.includes('契約') || text.includes('移籍') || text.includes('昇格') || text.includes('離脱')) {
    topics.push('Contract');
  }
  if (text.includes('fia') || text.includes('penalty') || text.includes('steward') || text.includes('regulation') || text.includes('rule') || text.includes('ペナルティ') || text.includes('規則') || text.includes('審議')) {
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

function inferAuthorityLevel(source: string, category: string, title: string, teamsCount: number): NewsAuthorityLevel {
  const s = source.toLowerCase();
  const t = title.toLowerCase();
  if (s.includes('fia') || category === 'FIA' || t.includes('fia公式') || t.includes('世界モータースポーツ評議会')) {
    return 'FIA_OFFICIAL';
  }
  if (s.includes('fod') || s.includes('フジテレビ') || s.includes('strategy desk') || s.includes('f1 tv') || s.includes('f1 live') || s.includes('中継')) {
    return 'BROADCAST_PRIMARY';
  }
  if (s.includes('team') || s.includes('constructor') || (teamsCount > 0 && (t.includes('公式') || t.includes('声明') || t.includes('発表') || t.includes('公開')))) {
    return 'CONSTRUCTOR_OFFICIAL';
  }
  return 'PADDOCK_INTEL';
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
    authorityLevel: 'CONSTRUCTOR_OFFICIAL',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    topics: ['Aero', 'Strategy'],
    teams: [{ name: 'Red Bull', color: '#38bdf8', bgColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)' }],
    drivers: ['VER'],
  },
  {
    id: 'fb-2',
    title: 'フェラーリ、ロングランでのリアタイヤ発熱を抑えるサスペンションジオメトリ改良を実施',
    summary: '第2スティント以降のハードタイヤにおける熱ダレを抑制するため、リアサスペンションのアンチスクワット角とキャンバー変化率を再最適化。ルクレールとハミルトンが実走検証。',
    link: 'https://www.motorsport.com/f1/news/ferrari-tyre-degradation-setup/',
    source: 'Motorsport.com',
    pubDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    category: 'TECHNICAL',
    authorityLevel: 'CONSTRUCTOR_OFFICIAL',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    topics: ['Tyre', 'Aero'],
    teams: [{ name: 'Ferrari', color: '#f87171', bgColor: 'rgba(248, 113, 113, 0.15)', borderColor: 'rgba(248, 113, 113, 0.4)' }],
    drivers: ['LEC', 'HAM'],
  },
  {
    id: 'fb-3',
    title: 'マクラーレン、ノリスとピアストリのタイトル争いを支える新型Hウィングを公開',
    summary: '高速サーキットでの直線スピードとDRS効率を両立させる新型リヤウィングを投入。低ドラッグ特性によりトップスピード向上を狙う。',
    link: 'https://www.motorsport.com/f1/news/mclaren-rear-wing-update/',
    source: 'Motorsport.com Live',
    pubDate: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    category: 'TECHNICAL',
    authorityLevel: 'CONSTRUCTOR_OFFICIAL',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    topics: ['Aero'],
    teams: [{ name: 'McLaren', color: '#fb923c', bgColor: 'rgba(251, 146, 60, 0.15)', borderColor: 'rgba(251, 146, 60, 0.4)' }],
    drivers: ['NOR', 'PIA'],
  },
  {
    id: 'fb-4',
    title: 'パドック速報：アウディワークス参戦準備と2026年PU開発ベンチマークの最新情報',
    summary: 'ヒュルケンベルグとボルトレートを擁するザウバー/アウディ陣営が、ノイブルク開発拠点での新規定50:50ハイブリッドPU単体テストで高効率回生数値を記録。',
    link: 'https://www.formula1.com/en/latest/article.audi-2026-update.html',
    source: 'Paddock Insider',
    pubDate: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    category: 'PADDOCK',
    authorityLevel: 'PADDOCK_INTEL',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    topics: ['Contract', 'PU'],
    teams: [
      { name: 'Audi', color: '#e0001a', bgColor: 'rgba(224, 0, 26, 0.15)', borderColor: 'rgba(224, 0, 26, 0.4)' },
      { name: 'Aston Martin', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.15)', borderColor: 'rgba(52, 211, 153, 0.4)' },
    ],
    drivers: ['HUL', 'BOR', 'ALO'],
  },
  {
    id: 'fb-5',
    title: 'FIA世界モータースポーツ評議会：2026年アクティブ空力詳細規則を正式承認。X/Zモード規定が確定',
    summary: 'フロントおよびリアの連動フラップ機構、MGU-K 350kW出力特性、およびMOMオーバーテイク規定の詳細付則が批准。',
    link: 'https://www.fia.com/news/fia-formula-1-regulations-2026',
    source: 'FIA World Motor Sport Council',
    pubDate: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    category: 'FIA',
    authorityLevel: 'FIA_OFFICIAL',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    topics: ['FIA', 'Aero', 'PU'],
    teams: [],
    drivers: [],
  },
  {
    id: 'fb-6',
    title: '決勝レース戦略展望：路面温度の低下とアンダーカット威力が鍵を握る2ストップ戦',
    summary: 'ナイトセッションでのトラックエボリューション（路面グリップ向上）を考慮し、ピレリ推奨のソフトからハードへの乗り換えタイミングが勝敗の分岐点に。国内公式中継FODにて完全生解説。',
    link: 'https://www.formula1.com/en/latest/article.strategy-guide.html',
    source: 'FOD / フジテレビNEXT 中継解説デスク',
    pubDate: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    category: 'RACE',
    authorityLevel: 'BROADCAST_PRIMARY',
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
              const authLevel = inferAuthorityLevel('Motorsport.com Live', cat, title, teams.length);

              liveArticles.push({
                id: `rss-${count}-${Date.now()}`,
                title,
                summary: rawDesc || title,
                link,
                source: 'Motorsport.com Live',
                pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
                category: cat,
                authorityLevel: authLevel,
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
