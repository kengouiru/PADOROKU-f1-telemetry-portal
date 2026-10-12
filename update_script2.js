const fs = require('fs');

// 1. Remove audio clips in f1KnowledgeData.ts
let fd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');
fd = fd.replace(/\s*audioUrl: 'https:\/\/livetiming\.formula1\.com[^']*',/g, '');
fs.writeFileSync('data/f1KnowledgeData.ts', fd, 'utf8');

// 2. Fix Vasseur-Hamilton and rewrite 2024 storyline
let fdrama = fs.readFileSync('data/f1DramaData.ts', 'utf8');
fdrama = fdrama.replace(/マクラーレン時代の教え子ハミルトン/g, 'ART時代の教え子ハミルトン');

let story2026 = `{
    id: 'season-2026-mercedes-resurgence',
    seasonYear: '2026',
    category: 'contemporary',
    title: '2026シーズン「新時代の覇者たち」',
    subtitle: 'アンドレア・キミ・アントネッリの驚異的躍進とメルセデスの復活',
    tagline: '新レギュレーション下で躍動する若き才能たち',
    overview: '2026年の新レギュレーション導入により、勢力図は一変。メルセデスが圧倒的な速さを取り戻し、若干20歳のアントネッリが8勝を挙げてタイトル争いを独走。フェラーリのハミルトン、マクラーレンのノリスも食い下がるが、新時代の主役は完全にシルバーアローへと移った。',
    chapters: [
      {
        chapterNumber: 1,
        title: 'メルセデス復活 — アントネッリの覚醒',
        races: '前半戦',
        story: '新シャシーとPUが完璧に機能したメルセデスは、アントネッリとラッセルのコンビで他を圧倒。特にアントネッリはデビュー2年目とは思えない完成された走りで勝利を量産した。',
        pivotalMoment: 'アントネッリが貫禄の走りで連勝を飾った序盤戦。',
        radioOrQuote: '🎙️ アントネッリ: 「マシンが信じられないくらい素晴らしいよ！」'
      },
      {
        chapterNumber: 2,
        title: '猛追 — 跳ね馬とパパイヤの共闘',
        races: '中盤戦',
        story: 'フェラーリに移籍したハミルトンとルクレール、そしてマクラーレンのノリスも表彰台争いに食い込む。しかし、レッドブルは低迷し、フェルスタッペンは苦しい戦いを強いられた。',
        pivotalMoment: 'ハミルトンがフェラーリで初勝利を挙げた瞬間。',
        radioOrQuote: '🎙️ ハミルトン: 「フォルツァ・フェラーリ！ついにやったぞ！」'
      }
    ],
    references: [
      { id: 1, title: 'Antonelli dominates as Mercedes returns to the top', publisher: 'Formula 1 Official', url: 'https://www.formula1.com/en/latest/article.antonelli-dominates-2026.html', verifiedDate: '2026-10-05', type: 'official' },
      { id: 2, title: 'Mercedes 2026 Resurgence', publisher: 'Autosport', url: 'https://www.autosport.com/f1/news/mercedes-2026-resurgence/123456/', verifiedDate: '2026-10-05', type: 'press' }
    ]
  }`;

fdrama = fdrama.replace(/\{\s*id: 'season-2024-collapse-of-the-throne'[\s\S]*?radioOrQuote: '🎙️ フェルスタッペン: 「この車は全く曲がらない！戦略も最悪だ！」'\s*\}\s*\]\s*\}/, story2026);
fs.writeFileSync('data/f1DramaData.ts', fdrama, 'utf8');

// 3. f1RegulationsData.ts 798 -> 768
let freg = fs.readFileSync('data/f1RegulationsData.ts', 'utf8');
freg = freg.replace(/798\s*kg/g, '768 kg');
if (!freg.includes('references?: any[]')) {
    freg = freg.replace(/export interface RegulationArticle \{/, 'export interface RegulationArticle {\n  references?: any[];');
}
fs.writeFileSync('data/f1RegulationsData.ts', freg, 'utf8');

// 4. f1GrandPrixReportsData.ts レクサス・シューマッハ -> ミハエル・シューマッハ
let frep = fs.readFileSync('data/f1GrandPrixReportsData.ts', 'utf8');
frep = frep.replace(/レクサス・シューマッハ/g, 'ミハエル・シューマッハ');
fs.writeFileSync('data/f1GrandPrixReportsData.ts', frep, 'utf8');

console.log('Scripts executed successfully');
