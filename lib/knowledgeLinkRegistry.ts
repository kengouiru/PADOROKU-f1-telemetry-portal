/**
 * lib/knowledgeLinkRegistry.ts
 * Wikipedia-style Universal Knowledge Link Registry & Parser
 *
 * Automatically detects F1 terminology, driver names, team names, circuits,
 * and regulation topics in explanatory texts and turns them into subtle,
 * clickable links with a dotted underline opening in a new tab/window.
 */

import { GLOSSARY_TERMS } from '@/data/f1GlossaryData';

export interface KnowledgeLinkEntry {
  keyword: string; // The text to match (e.g. 'アンダーカット', 'フェルスタッペン')
  url: string; // The destination URL (e.g. '/knowledge/glossary/undercut')
  category: 'glossary' | 'driver' | 'team' | 'circuit' | 'rule';
  title: string; // Tooltip title
}

// ── Built-in Driver Keyword Mapping ──────────────────────────────────────────
const DRIVER_KEYWORD_MAP: { keyword: string; code: string; name: string }[] = [
  // 2026 Grid
  { keyword: 'フェルスタッペン', code: 'VER', name: 'マックス・フェルスタッペン' },
  { keyword: 'マックス・フェルスタッペン', code: 'VER', name: 'マックス・フェルスタッペン' },
  { keyword: 'ハミルトン', code: 'HAM', name: 'ルイス・ハミルトン' },
  { keyword: 'ルイス・ハミルトン', code: 'HAM', name: 'ルイス・ハミルトン' },
  { keyword: 'サインツ', code: 'SAI', name: 'カルロス・サインツ' },
  { keyword: 'カルロス・サインツ', code: 'SAI', name: 'カルロス・サインツ' },
  { keyword: 'ルクレール', code: 'LEC', name: 'シャルル・ルクレール' },
  { keyword: 'シャルル・ルクレール', code: 'LEC', name: 'シャルル・ルクレール' },
  { keyword: 'ノリス', code: 'NOR', name: 'ランド・ノリス' },
  { keyword: 'ランド・ノリス', code: 'NOR', name: 'ランド・ノリス' },
  { keyword: 'ピアストリ', code: 'PIA', name: 'オスカー・ピアストリ' },
  { keyword: 'オスカー・ピアストリ', code: 'PIA', name: 'オスカー・ピアストリ' },
  { keyword: 'ラッセル', code: 'RUS', name: 'ジョージ・ラッセル' },
  { keyword: 'ジョージ・ラッセル', code: 'RUS', name: 'ジョージ・ラッセル' },
  { keyword: 'アロンソ', code: 'ALO', name: 'フェルナンド・アロンソ' },
  { keyword: 'フェルナンド・アロンソ', code: 'ALO', name: 'フェルナンド・アロンソ' },
  { keyword: '角田裕毅', code: 'TSU', name: '角田裕毅' },
  { keyword: '角田', code: 'TSU', name: '角田裕毅' },
  { keyword: 'アルボン', code: 'ALB', name: 'アレクサンダー・アルボン' },
  { keyword: 'ガスリー', code: 'GAS', name: 'ピエール・ガスリー' },
  { keyword: 'オコン', code: 'OCO', name: 'エステバン・オコン' },
  { keyword: 'ストロール', code: 'STR', name: 'ランス・ストロール' },
  { keyword: 'ヒュルケンベルグ', code: 'HUL', name: 'ニコ・ヒュルケンベルグ' },
  { keyword: 'ボッタス', code: 'BOT', name: 'バルテリ・ボッタス' },
  { keyword: 'ペレス', code: 'PER', name: 'セルジオ・ペレス' },
  { keyword: 'ベアマン', code: 'BEA', name: 'オリバー・ベアマン' },
  { keyword: 'コラピント', code: 'COL', name: 'フランコ・コラピント' },
  { keyword: 'ドゥーハン', code: 'DOO', name: 'ジャック・ドゥーハン' },
  { keyword: 'ローソン', code: 'LAW', name: 'リアム・ローソン' },
  { keyword: 'アントネッリ', code: 'ANT', name: 'キミ・アントネッリ' },
  { keyword: 'ボルトレート', code: 'BOR', name: 'ガブリエル・ボルトレート' },
  { keyword: 'ハジャル', code: 'HAD', name: 'イサック・ハジャル' },
  // Hall of Fame Legends
  { keyword: 'アイルトン・セナ', code: 'SEN', name: 'アイルトン・セナ' },
  { keyword: 'セナ', code: 'SEN', name: 'アイルトン・セナ' },
  { keyword: 'ミハエル・シューマッハ', code: 'MSC', name: 'ミハエル・シューマッハ' },
  { keyword: 'シューマッハ', code: 'MSC', name: 'ミハエル・シューマッハ' },
  { keyword: 'アラン・プロスト', code: 'PRO', name: 'アラン・プロスト' },
  { keyword: 'プロスト', code: 'PRO', name: 'アラン・プロスト' },
  { keyword: 'ニキ・ラウダ', code: 'LAU', name: 'ニキ・ラウダ' },
  { keyword: 'ラウダ', code: 'LAU', name: 'ニキ・ラウダ' },
  { keyword: 'セバスチャン・ベッテル', code: 'VET', name: 'セバスチャン・ベッテル' },
  { keyword: 'ベッテル', code: 'VET', name: 'セバスチャン・ベッテル' },
  { keyword: 'キミ・ライコネン', code: 'RAI', name: 'キミ・ライコネン' },
  { keyword: 'ライコネン', code: 'RAI', name: 'キミ・ライコネン' },
  { keyword: 'ミカ・ハッキネン', code: 'HAK', name: 'ミカ・ハッキネン' },
  { keyword: 'ハッキネン', code: 'HAK', name: 'ミカ・ハッキネン' },
  { keyword: 'ナイジェル・マンセル', code: 'MAN', name: 'ナイジェル・マンセル' },
  { keyword: 'マンセル', code: 'MAN', name: 'ナイジェル・マンセル' },
  { keyword: 'リカルド', code: 'RIC', name: 'ダニエル・リカルド' },
];

// ── Built-in Team Keyword Mapping ────────────────────────────────────────────
const TEAM_KEYWORD_MAP: { keyword: string; id: string; name: string }[] = [
  { keyword: 'レッドブル・レーシング', id: 'redbull', name: 'Red Bull Racing' },
  { keyword: 'レッドブル', id: 'redbull', name: 'Red Bull Racing' },
  { keyword: 'スクーデリア・フェラーリ', id: 'ferrari', name: 'Ferrari' },
  { keyword: 'フェラーリ', id: 'ferrari', name: 'Ferrari' },
  { keyword: 'メルセデス-AMG', id: 'mercedes', name: 'Mercedes-AMG' },
  { keyword: 'メルセデス', id: 'mercedes', name: 'Mercedes-AMG' },
  { keyword: 'マクラーレン', id: 'mclaren', name: 'McLaren' },
  { keyword: 'アストンマーティン', id: 'astonmartin', name: 'Aston Martin' },
  { keyword: 'アルピーヌ', id: 'alpine', name: 'Alpine' },
  { keyword: 'ウィリアムズ・レーシング', id: 'williams', name: 'Williams Racing' },
  { keyword: 'ウィリアムズ', id: 'williams', name: 'Williams Racing' },
  { keyword: 'アウディF1', id: 'audi', name: 'Audi F1 Team' },
  { keyword: 'アウディ', id: 'audi', name: 'Audi F1 Team' },
  { keyword: 'ハースF1', id: 'haas', name: 'Haas F1 Team' },
  { keyword: 'ハース', id: 'haas', name: 'Haas F1 Team' },
  { keyword: 'キャデラックF1', id: 'cadillac', name: 'Cadillac F1 Team' },
  { keyword: 'キャデラック', id: 'cadillac', name: 'Cadillac F1 Team' },
  { keyword: 'レーシング・ブルズ', id: 'rb', name: 'Racing Bulls' },
];

// ── Rule & Technical Keyword Mapping ─────────────────────────────────────────
const RULE_KEYWORD_MAP: { keyword: string; url: string; title: string }[] = [
  { keyword: 'アクティブエアロ', url: '/knowledge/rules', title: '2026年規定: アクティブ・エアロダイナミクス解説' },
  { keyword: 'Active Aero', url: '/knowledge/rules', title: '2026年規定: アクティブ・エアロダイナミクス解説' },
  { keyword: '持続可能燃料', url: '/knowledge/rules', title: '2026年規定: 100%持続可能カーボンニュートラル燃料解説' },
  { keyword: 'スチュワード裁定', url: '/knowledge/rules', title: 'FIA 審議基準・ペナルティ基準解説' },
  { keyword: 'スチュワード', url: '/knowledge/rules', title: 'FIA スチュワード・審議ルール解説' },
  { keyword: '競技規則', url: '/knowledge/rules', title: 'FIA F1 公式競技規則（Sporting Regulations）' },
  { keyword: '技術規則', url: '/knowledge/rules', title: 'FIA F1 公式技術規則（Technical Regulations）' },
];

// ── Build Full Keyword Registry ──────────────────────────────────────────────
export function getKnowledgeLinkRegistry(): KnowledgeLinkEntry[] {
  const entries: KnowledgeLinkEntry[] = [];

  // 1. Glossary Terms
  GLOSSARY_TERMS.forEach((term) => {
    // Japanese main term
    const cleanTerm = term.term.split('(')[0].trim();
    if (cleanTerm.length >= 2) {
      entries.push({
        keyword: cleanTerm,
        url: `/knowledge/glossary/${term.id}`,
        category: 'glossary',
        title: `用語解説「${term.term}」を別タブで開く`,
      });
    }

    // Term with aliases
    if (term.id === 'undercut') {
      entries.push({ keyword: 'アンダーカット', url: '/knowledge/glossary/undercut', category: 'glossary', title: '用語解説「アンダーカット」を別タブで開く' });
    } else if (term.id === 'overcut') {
      entries.push({ keyword: 'オーバーカット', url: '/knowledge/glossary/overcut', category: 'glossary', title: '用語解説「オーバーカット」を別タブで開く' });
    } else if (term.id === 'degradation') {
      entries.push({ keyword: 'デグラデーション', url: '/knowledge/glossary/degradation', category: 'glossary', title: '用語解説「デグラデーション」を別タブで開く' });
      entries.push({ keyword: 'タイヤデグラデーション', url: '/knowledge/glossary/degradation', category: 'glossary', title: '用語解説「デグラデーション」を別タブで開く' });
    } else if (term.id === 'drs') {
      entries.push({ keyword: 'DRS', url: '/knowledge/glossary/drs', category: 'glossary', title: '用語解説「DRS」を別タブで開く' });
    } else if (term.id === 'slipstream') {
      entries.push({ keyword: 'スリップストリーム', url: '/knowledge/glossary/slipstream', category: 'glossary', title: '用語解説「スリップストリーム」を別タブで開く' });
    } else if (term.id === 'dirty-air') {
      entries.push({ keyword: 'ダーティエア', url: '/knowledge/glossary/dirty-air', category: 'glossary', title: '用語解説「ダーティエア」を別タブで開く' });
    } else if (term.id === 'clean-air') {
      entries.push({ keyword: 'クリーンエア', url: '/knowledge/glossary/clean-air', category: 'glossary', title: '用語解説「クリーンエア」を別タブで開く' });
    } else if (term.id === 'porpoising') {
      entries.push({ keyword: 'ポーパシング', url: '/knowledge/glossary/porpoising', category: 'glossary', title: '用語解説「ポーパシング」を別タブで開く' });
    } else if (term.id === 'ground-effect') {
      entries.push({ keyword: 'グラウンド・エフェクト', url: '/knowledge/glossary/ground-effect', category: 'glossary', title: '用語解説「グラウンド・エフェクト」を別タブで開く' });
      entries.push({ keyword: 'グラウンドエフェクト', url: '/knowledge/glossary/ground-effect', category: 'glossary', title: '用語解説「グラウンド・エフェクト」を別タブで開く' });
    } else if (term.id === 'parc-ferme') {
      entries.push({ keyword: 'パルクフェルメ', url: '/knowledge/glossary/parc-ferme', category: 'glossary', title: '用語解説「パルクフェルメ」を別タブで開く' });
    } else if (term.id === 'telemetry') {
      entries.push({ keyword: 'テレメトリー', url: '/knowledge/glossary/telemetry', category: 'glossary', title: '用語解説「テレメトリー」を別タブで開く' });
    } else if (term.id === 'apex') {
      entries.push({ keyword: 'エイペックス', url: '/knowledge/glossary/apex', category: 'glossary', title: '用語解説「エイペックス」を別タブで開く' });
    } else if (term.id === 'bottom-speed') {
      entries.push({ keyword: 'ボトムスピード', url: '/knowledge/glossary/bottom-speed', category: 'glossary', title: '用語解説「ボトムスピード」を別タブで開く' });
    } else if (term.id === 'trail-braking') {
      entries.push({ keyword: 'トレイルブレーキング', url: '/knowledge/glossary/trail-braking', category: 'glossary', title: '用語解説「トレイルブレーキング」を別タブで開く' });
    } else if (term.id === 'delta-time') {
      entries.push({ keyword: 'デルタタイム', url: '/knowledge/glossary/delta-time', category: 'glossary', title: '用語解説「デルタタイム」を別タブで開く' });
    } else if (term.id === 'downforce') {
      entries.push({ keyword: 'ダウンフォース', url: '/knowledge/glossary/downforce', category: 'glossary', title: '用語解説「ダウンフォース」を別タブで開く' });
    } else if (term.id === 'halo') {
      entries.push({ keyword: 'HALO', url: '/knowledge/glossary/halo', category: 'glossary', title: '用語解説「HALO」を別タブで開く' });
    } else if (term.id === 'mgu-k') {
      entries.push({ keyword: 'MGU-K', url: '/knowledge/glossary/mgu-k', category: 'glossary', title: '用語解説「MGU-K」を別タブで開く' });
    } else if (term.id === 'safety-car') {
      entries.push({ keyword: 'セーフティカー', url: '/knowledge/glossary/safety-car', category: 'glossary', title: '用語解説「セーフティカー」を別タブで開く' });
    } else if (term.id === 'track-limits') {
      entries.push({ keyword: 'トラックリミット', url: '/knowledge/glossary/track-limits', category: 'glossary', title: '用語解説「トラックリミット」を別タブで開く' });
    }
  });

  // 2. Driver Mapping
  DRIVER_KEYWORD_MAP.forEach((d) => {
    entries.push({
      keyword: d.keyword,
      url: `/knowledge/drivers/${d.code}`,
      category: 'driver',
      title: `ドライバー名鑑「${d.name}」を別タブで開く`,
    });
  });

  // 3. Team Mapping
  TEAM_KEYWORD_MAP.forEach((t) => {
    entries.push({
      keyword: t.keyword,
      url: `/knowledge/teams/${t.id}`,
      category: 'team',
      title: `チーム系統樹・諸元「${t.name}」を別タブで開く`,
    });
  });

  // 4. Rule Mapping
  RULE_KEYWORD_MAP.forEach((r) => {
    entries.push({
      keyword: r.keyword,
      url: r.url,
      category: 'rule',
      title: r.title,
    });
  });

  // Sort by keyword length descending so longer phrases match first (e.g. 'アイルトン・セナ' before 'セナ')
  return entries.sort((a, b) => b.keyword.length - a.keyword.length);
}

// Cached sorted entries
let cachedRegistry: KnowledgeLinkEntry[] | null = null;
export function getSortedRegistry(): KnowledgeLinkEntry[] {
  if (!cachedRegistry) {
    cachedRegistry = getKnowledgeLinkRegistry();
  }
  return cachedRegistry;
}

// ── Text Parsing Tokenizer ───────────────────────────────────────────────────
export interface TextToken {
  type: 'text' | 'link';
  content: string;
  url?: string;
  title?: string;
  category?: string;
}

/**
 * Parses plain text into text segments and clickable keyword links.
 * Respects maxLinksPerTerm so words aren't over-linked repeatedly in the same paragraph.
 */
export function parseWikiText(
  text: string,
  options?: {
    excludeUrl?: string; // Prevent linking to the current page itself
    maxLinksPerTerm?: number; // Defaults to 1 per term
  }
): TextToken[] {
  if (!text || typeof text !== 'string') {
    return [{ type: 'text', content: text || '' }];
  }

  const registry = getSortedRegistry();
  const maxPerTerm = options?.maxLinksPerTerm ?? 1;
  const excludeUrl = options?.excludeUrl?.toLowerCase();

  const termCounts = new Map<string, number>();

  // Filter usable entries
  const availableEntries = registry.filter((entry) => {
    if (excludeUrl && entry.url.toLowerCase() === excludeUrl) return false;
    return true;
  });

  // Build a single Regex with all keywords
  // Escape regex special characters
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    availableEntries.map((e) => escapeRegex(e.keyword)).join('|'),
    'g'
  );

  const tokens: TextToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const matchedKeyword = match[0];
    const matchIndex = match.index;

    // Check frequency limit
    const currentCount = termCounts.get(matchedKeyword) || 0;
    if (currentCount >= maxPerTerm) {
      continue;
    }

    // Find entry
    const entry = availableEntries.find((e) => e.keyword === matchedKeyword);
    if (!entry) continue;

    // Push preceding text if any
    if (matchIndex > lastIndex) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex, matchIndex),
      });
    }

    // Push link token
    tokens.push({
      type: 'link',
      content: matchedKeyword,
      url: entry.url,
      title: entry.title,
      category: entry.category,
    });

    termCounts.set(matchedKeyword, currentCount + 1);
    lastIndex = matchIndex + matchedKeyword.length;
  }

  // Push remainder
  if (lastIndex < text.length) {
    tokens.push({
      type: 'text',
      content: text.substring(lastIndex),
    });
  }

  return tokens;
}
