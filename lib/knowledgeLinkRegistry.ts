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
  { keyword: 'レッドブル・レーシング', id: 'red-bull', name: 'Red Bull Racing' },
  { keyword: 'レッドブル', id: 'red-bull', name: 'Red Bull Racing' },
  { keyword: 'スクーデリア・フェラーリ', id: 'ferrari', name: 'Ferrari' },
  { keyword: 'フェラーリ', id: 'ferrari', name: 'Ferrari' },
  { keyword: 'メルセデス-AMG', id: 'mercedes', name: 'Mercedes-AMG' },
  { keyword: 'メルセデス', id: 'mercedes', name: 'Mercedes-AMG' },
  { keyword: 'マクラーレン', id: 'mclaren', name: 'McLaren' },
  { keyword: 'アストンマーティン', id: 'aston-martin', name: 'Aston Martin' },
  { keyword: 'アルピーヌ', id: 'alpine', name: 'Alpine' },
  { keyword: 'ウィリアムズ・レーシング', id: 'williams', name: 'Williams Racing' },
  { keyword: 'ウィリアムズ', id: 'williams', name: 'Williams Racing' },
  { keyword: 'アウディF1', id: 'audi', name: 'Audi F1 Team' },
  { keyword: 'アウディ', id: 'audi', name: 'Audi F1 Team' },
  { keyword: 'ハースF1', id: 'haas', name: 'Haas F1 Team' },
  { keyword: 'ハース', id: 'haas', name: 'Haas F1 Team' },
  { keyword: 'キャデラックF1', id: 'cadillac', name: 'Cadillac F1 Team' },
  { keyword: 'キャデラック', id: 'cadillac', name: 'Cadillac F1 Team' },
  { keyword: 'レーシング・ブルズ', id: 'racing-bulls', name: 'Racing Bulls' },
  { keyword: 'ホンダF1', id: 'aston-martin', name: 'Honda Works (Aston Martin)' },
  { keyword: 'ホンダ', id: 'aston-martin', name: 'Honda Works (Aston Martin)' },
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

// ── Key Personnel & Team Principal Mapping ──────────────────────────────────
const PERSONNEL_KEYWORD_MAP: { keyword: string; url: string; title: string }[] = [
  { keyword: 'エイドリアン・ニューウェイ', url: '/knowledge/teams/aston-martin', title: 'アストンマーティン マネージング・テクニカル・パートナー: エイドリアン・ニューウェイ' },
  { keyword: 'ニューウェイ', url: '/knowledge/teams/aston-martin', title: '天才空力設計者: エイドリアン・ニューウェイ (アストンマーティン)' },
  { keyword: '小松礼雄', url: '/knowledge/teams/haas', title: 'ハースF1チーム チーム代表: 小松礼雄' },
  { keyword: 'マッティア・ビノット', url: '/knowledge/teams/audi', title: 'アウディF1 最高執行責任者/最高技術責任者: マッティア・ビノット' },
  { keyword: 'トト・ウォルフ', url: '/knowledge/teams/mercedes', title: 'メルセデス-AMG チーム代表 & CEO: トト・ウォルフ' },
  { keyword: 'クリスチャン・ホーナー', url: '/knowledge/teams/red-bull', title: 'レッドブル・レーシング チーム代表 & CEO: クリスチャン・ホーナー' },
  { keyword: 'フレデリック・バスール', url: '/knowledge/teams/ferrari', title: 'スクーデリア・フェラーリ チーム代表: フレデリック・バスール' },
  { keyword: 'ジェームズ・ボウルズ', url: '/knowledge/teams/williams', title: 'ウィリアムズ・レーシング チーム代表: ジェームズ・ボウルズ' },
];

// ── Iconic Circuits Mapping ──────────────────────────────────────────────────
const CIRCUIT_KEYWORD_MAP: { keyword: string; id: string; name: string }[] = [
  { keyword: '鈴鹿サーキット', id: 'suzuka', name: '鈴鹿サーキット (日本GP)' },
  { keyword: '鈴鹿', id: 'suzuka', name: '鈴鹿サーキット (日本GP)' },
  { keyword: 'モンツァ・サーキット', id: 'monza', name: 'モンツァ・サーキット (イタリアGP)' },
  { keyword: 'モンツァ', id: 'monza', name: 'モンツァ・サーキット (イタリアGP)' },
  { keyword: 'シルバーストン・サーキット', id: 'silverstone', name: 'シルバーストン・サーキット (イギリスGP)' },
  { keyword: 'シルバーストン', id: 'silverstone', name: 'シルバーストン・サーキット (イギリスGP)' },
  { keyword: 'スパ・フランコルシャン', id: 'spa-francorchamps', name: 'スパ・フランコルシャン (ベルギーGP)' },
  { keyword: 'スパ', id: 'spa-francorchamps', name: 'スパ・フランコルシャン (ベルギーGP)' },
  { keyword: 'モンテカルロ市街地コース', id: 'circuit-de-monaco', name: 'モンテカルロ市街地コース (モナコGP)' },
  { keyword: 'モナコ市街地コース', id: 'circuit-de-monaco', name: 'モンテカルロ市街地コース (モナコGP)' },
  { keyword: 'モナコ', id: 'circuit-de-monaco', name: 'モンテカルロ市街地コース (モナコGP)' },
  { keyword: 'IFEMAマドリード市街地コース', id: 'madrid', name: 'マドリング IFEMA市街地コース (マドリードGP)' },
  { keyword: 'マドリード市街地コース', id: 'madrid', name: 'マドリング IFEMA市街地コース (マドリードGP)' },
  { keyword: 'マドリング', id: 'madrid', name: 'マドリング IFEMA市街地コース (マドリードGP)' },
  { keyword: 'マドリード', id: 'madrid', name: 'マドリング IFEMA市街地コース (マドリードGP)' },
  { keyword: 'インテルラゴス', id: 'interlagos', name: 'インテルラゴス・サーキット (サンパウロGP)' },
  { keyword: 'アルバート・パーク', id: 'albert-park', name: 'アルバート・パーク・サーキット (オーストラリアGP)' },
  { keyword: 'バクー市街地コース', id: 'baku', name: 'バクー市街地コース (アゼルバイジャンGP)' },
  { keyword: 'バクー', id: 'baku', name: 'バクー市街地コース (アゼルバイジャンGP)' },
  { keyword: 'マリーナベイ・ストリート・サーキット', id: 'singapore', name: 'マリーナベイ・ストリート・サーキット (シンガポールGP)' },
  { keyword: 'マリーナベイ', id: 'singapore', name: 'マリーナベイ・ストリート・サーキット (シンガポールGP)' },
  { keyword: 'ラスベガス・ストリップ・サーキット', id: 'las-vegas', name: 'ラスベガス・ストリップ・サーキット (ラスベガスGP)' },
  { keyword: 'ラスベガス', id: 'las-vegas', name: 'ラスベガス・ストリップ・サーキット (ラスベガスGP)' },
  { keyword: 'カタロニア・サーキット', id: 'catalunya', name: 'カタロニア・サーキット (スペインGP)' },
  { keyword: 'カタロニア', id: 'catalunya', name: 'カタロニア・サーキット (スペインGP)' },
  { keyword: 'ジル・ヴィルヌーヴ・サーキット', id: 'villeneuve', name: 'ジル・ヴィルヌーヴ・サーキット (カナダGP)' },
  { keyword: 'レッドブル・リンク', id: 'redbull-ring', name: 'レッドブル・リンク (オーストリアGP)' },
  { keyword: 'ハンガロリンク', id: 'hungaroring', name: 'ハンガロリンク (ハンガリーGP)' },
  { keyword: 'ザントフォールト', id: 'zandvoort', name: 'ザントフォールト・サーキット (オランダGP)' },
  { keyword: 'バーレーン・インターナショナル・サーキット', id: 'bahrain-international', name: 'バーレーン・インターナショナル・サーキット (バーレーンGP)' },
  { keyword: 'バーレーン', id: 'bahrain-international', name: 'バーレーン・インターナショナル・サーキット (バーレーンGP)' },
  { keyword: 'ジェッダ・コーニッシュ・サーキット', id: 'jeddah', name: 'ジェッダ・コーニッシュ・サーキット (サウジアラビアGP)' },
  { keyword: 'ジェッダ', id: 'jeddah', name: 'ジェッダ・コーニッシュ・サーキット (サウジアラビアGP)' },
  { keyword: '上海インターナショナル・サーキット', id: 'shanghai', name: '上海インターナショナル・サーキット (中国GP)' },
  { keyword: '上海', id: 'shanghai', name: '上海インターナショナル・サーキット (中国GP)' },
  { keyword: 'マイアミ・インターナショナル・オートドローム', id: 'miami', name: 'マイアミ・インターナショナル・オートドローム (マイアミGP)' },
  { keyword: 'マイアミ', id: 'miami', name: 'マイアミ・インターナショナル・オートドローム (マイアミGP)' },
  { keyword: 'サーキット・オブ・ジ・アメリカズ', id: 'cota', name: 'サーキット・オブ・ジ・アメリカズ (アメリカGP)' },
  { keyword: 'COTA', id: 'cota', name: 'サーキット・オブ・ジ・アメリカズ (アメリカGP)' },
  { keyword: 'エルマノス・ロドリゲス・サーキット', id: 'mexico', name: 'エルマノス・ロドリゲス・サーキット (メキシコGP)' },
  { keyword: 'ルサイル・インターナショナル・サーキット', id: 'losail', name: 'ルサイル・インターナショナル・サーキット (カタールGP)' },
  { keyword: 'ルサイル', id: 'losail', name: 'ルサイル・インターナショナル・サーキット (カタールGP)' },
  { keyword: 'ヤス・マリーナ・サーキット', id: 'yas-marina', name: 'ヤス・マリーナ・サーキット (アブダビGP)' },
  { keyword: 'ヤス・マリーナ', id: 'yas-marina', name: 'ヤス・マリーナ・サーキット (アブダビGP)' },
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
    } else if (term.id === 'active-aero') {
      entries.push({ keyword: 'アクティブエアロ', url: '/knowledge/glossary/active-aero', category: 'glossary', title: '用語解説「アクティブ・エアロダイナミクス」を別タブで開く' });
      entries.push({ keyword: 'Active Aero', url: '/knowledge/glossary/active-aero', category: 'glossary', title: '用語解説「アクティブ・エアロダイナミクス」を別タブで開く' });
      entries.push({ keyword: 'Xモード', url: '/knowledge/glossary/active-aero', category: 'glossary', title: '用語解説「Xモード (低ドラッグモード)」を別タブで開く' });
      entries.push({ keyword: 'Zモード', url: '/knowledge/glossary/active-aero', category: 'glossary', title: '用語解説「Zモード (高ダウンフォースモード)」を別タブで開く' });
    } else if (term.id === 'manual-override') {
      entries.push({ keyword: 'マニュアルオーバーライド', url: '/knowledge/glossary/manual-override', category: 'glossary', title: '用語解説「マニュアル・オーバーライド・モード」を別タブで開く' });
      entries.push({ keyword: 'マニュアル・オーバーライド', url: '/knowledge/glossary/manual-override', category: 'glossary', title: '用語解説「マニュアル・オーバーライド・モード」を別タブで開く' });
      entries.push({ keyword: 'MOM', url: '/knowledge/glossary/manual-override', category: 'glossary', title: '用語解説「マニュアル・オーバーライド・モード」を別タブで開く' });
    } else if (term.id === 'mgu-h') {
      entries.push({ keyword: 'MGU-H', url: '/knowledge/glossary/mgu-h', category: 'glossary', title: '用語解説「MGU-H」を別タブで開く' });
    } else if (term.id === 'sustainable-fuel') {
      entries.push({ keyword: '持続可能燃料', url: '/knowledge/glossary/sustainable-fuel', category: 'glossary', title: '用語解説「100% 持続可能合成燃料」を別タブで開く' });
      entries.push({ keyword: 'E-Fuel', url: '/knowledge/glossary/sustainable-fuel', category: 'glossary', title: '用語解説「E-Fuel」を別タブで開く' });
      entries.push({ keyword: 'E-fuel', url: '/knowledge/glossary/sustainable-fuel', category: 'glossary', title: '用語解説「E-Fuel」を別タブで開く' });
    } else if (term.id === 'vsc') {
      entries.push({ keyword: 'VSC', url: '/knowledge/glossary/vsc', category: 'glossary', title: '用語解説「VSC (バーチャルセーフティカー)」を別タブで開く' });
      entries.push({ keyword: 'バーチャルセーフティカー', url: '/knowledge/glossary/vsc', category: 'glossary', title: '用語解説「バーチャルセーフティカー」を別タブで開く' });
    } else if (term.id === 'steward') {
      entries.push({ keyword: 'スチュワード', url: '/knowledge/glossary/steward', category: 'glossary', title: '用語解説「FIA スチュワード」を別タブで開く' });
    } else if (term.id === 'cost-cap') {
      entries.push({ keyword: 'コストキャップ', url: '/knowledge/glossary/cost-cap', category: 'glossary', title: '用語解説「コストキャップ」を別タブで開く' });
    } else if (term.id === 'atr') {
      entries.push({ keyword: 'ATR', url: '/knowledge/glossary/atr', category: 'glossary', title: '用語解説「ATR (空力テスト制限)」を別タブで開く' });
      entries.push({ keyword: '空力テスト制限', url: '/knowledge/glossary/atr', category: 'glossary', title: '用語解説「空力テスト制限 (ATR)」を別タブで開く' });
    } else if (term.id === 'understeer') {
      entries.push({ keyword: 'アンダーステア', url: '/knowledge/glossary/understeer', category: 'glossary', title: '用語解説「アンダーステア」を別タブで開く' });
    } else if (term.id === 'oversteer') {
      entries.push({ keyword: 'オーバーステア', url: '/knowledge/glossary/oversteer', category: 'glossary', title: '用語解説「オーバーステア」を別タブで開く' });
    } else if (term.id === 'blistering') {
      entries.push({ keyword: 'ブリスタリング', url: '/knowledge/glossary/blistering', category: 'glossary', title: '用語解説「ブリスタリング」を別タブで開く' });
      entries.push({ keyword: 'ブリスター', url: '/knowledge/glossary/blistering', category: 'glossary', title: '用語解説「ブリスタリング」を別タブで開く' });
    } else if (term.id === 'graining') {
      entries.push({ keyword: 'グレイニング', url: '/knowledge/glossary/graining', category: 'glossary', title: '用語解説「グレイニング」を別タブで開く' });
    } else if (term.id === 'pit-window') {
      entries.push({ keyword: 'ピットウィンドウ', url: '/knowledge/glossary/pit-window', category: 'glossary', title: '用語解説「ピットウィンドウ」を別タブで開く' });
    } else if (term.id === 'outlap-inlap') {
      entries.push({ keyword: 'アウトラップ', url: '/knowledge/glossary/outlap-inlap', category: 'glossary', title: '用語解説「アウトラップ ＆ インラップ」を別タブで開く' });
      entries.push({ keyword: 'インラップ', url: '/knowledge/glossary/outlap-inlap', category: 'glossary', title: '用語解説「アウトラップ ＆ インラップ」を別タブで開く' });
    } else if (term.id === 'flying-lap') {
      entries.push({ keyword: 'フライングラップ', url: '/knowledge/glossary/flying-lap', category: 'glossary', title: '用語解説「フライングラップ」を別タブで開く' });
      entries.push({ keyword: 'ホットラップ', url: '/knowledge/glossary/flying-lap', category: 'glossary', title: '用語解説「フライングラップ」を別タブで開く' });
    }
  });

  // Additional technical terms & aliases
  entries.push({ keyword: 'アペックス', url: '/knowledge/glossary/apex', category: 'glossary', title: '用語解説「エイペックス (クリッピングポイント)」を別タブで開く' });
  entries.push({ keyword: '縁石', url: '/knowledge/glossary/apex', category: 'glossary', title: '用語解説「縁石 (ケルブ / トラックリミット)」を別タブで開く' });
  entries.push({ keyword: 'ケルブ', url: '/knowledge/glossary/apex', category: 'glossary', title: '用語解説「ケルブ (縁石)」を別タブで開く' });
  entries.push({ keyword: 'パワーユニット', url: '/knowledge/glossary/power-unit', category: 'glossary', title: '用語解説「パワーユニット (PU)」を別タブで開く' });
  entries.push({ keyword: 'ピットストップ', url: '/knowledge/glossary/undercut', category: 'glossary', title: '用語解説「ピットストップ戦略」を別タブで開く' });
  entries.push({ keyword: 'オーバーテイク', url: '/knowledge/glossary/slipstream', category: 'glossary', title: '用語解説「スリップストリーム＆オーバーテイク」を別タブで開く' });
  entries.push({ keyword: 'ブレーキバイアス', url: '/knowledge/glossary/trail-braking', category: 'glossary', title: '用語解説「ブレーキバランス＆バイアス配分」を別タブで開く' });
  entries.push({ keyword: 'トラクション', url: '/knowledge/glossary/apex', category: 'glossary', title: '用語解説「トラクション＆コーナー脱出」を別タブで開く' });
  entries.push({ keyword: 'ポールポジション', url: '/knowledge/glossary/pole-position', category: 'glossary', title: '用語解説「ポールポジション」を別タブで開く' });
  entries.push({ keyword: 'ファステストラップ', url: '/knowledge/glossary/fastest-lap', category: 'glossary', title: '用語解説「ファステストラップ」を別タブで開く' });
  entries.push({ keyword: 'チームオーダー', url: '/knowledge/glossary/team-order', category: 'glossary', title: '用語解説「チームオーダー」を別タブで開く' });
  entries.push({ keyword: 'ダブルスタック', url: '/knowledge/glossary/double-stack', category: 'glossary', title: '用語解説「ダブルスタック・ピットストップ」を別タブで開く' });
  entries.push({ keyword: 'タイヤウォーマー', url: '/knowledge/glossary/outlap-inlap', category: 'glossary', title: '用語解説「タイヤブランケット・熱入れ」を別タブで開く' });
  entries.push({ keyword: 'リフト＆コースト', url: '/knowledge/glossary/telemetry', category: 'glossary', title: '用語解説「リフト＆コースト (燃費・熱管理走法)」を別タブで開く' });
  entries.push({ keyword: 'フューエルセーブ', url: '/knowledge/glossary/telemetry', category: 'glossary', title: '用語解説「フューエルセーブ (燃料セーブ走法)」を別タブで開く' });
  entries.push({ keyword: 'サーマルデグラデーション', url: '/knowledge/glossary/degradation', category: 'glossary', title: '用語解説「サーマルデグラデーション (熱タレ)」を別タブで開く' });
  entries.push({ keyword: 'ドラッグ', url: '/knowledge/glossary/drs', category: 'glossary', title: '用語解説「空気抵抗 (ドラッグ)」を別タブで開く' });
  entries.push({ keyword: 'ボトミング', url: '/knowledge/glossary/porpoising', category: 'glossary', title: '用語解説「車高底付き (ボトミング)」を別タブで開く' });
  entries.push({ keyword: 'Manual Override Mode', url: '/knowledge/glossary/manual-override', category: 'glossary', title: '用語解説「マニュアル・オーバーライド・モード」を別タブで開く' });

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

  // 5. Personnel Mapping
  PERSONNEL_KEYWORD_MAP.forEach((p) => {
    entries.push({
      keyword: p.keyword,
      url: p.url,
      category: 'team',
      title: p.title,
    });
  });

  // 6. Circuit Mapping
  CIRCUIT_KEYWORD_MAP.forEach((c) => {
    entries.push({
      keyword: c.keyword,
      url: `/knowledge/circuits/${c.id}`,
      category: 'circuit',
      title: `サーキット解説「${c.name}」を別タブで開く`,
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
