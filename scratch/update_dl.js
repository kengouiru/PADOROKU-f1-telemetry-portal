const fs = require('fs');
let dl = fs.readFileSync('DECISION_LOG.md', 'utf-8');

const today = new Date().toISOString().split('T')[0];
const entry = `## [${today}] 巨大ファイル（10,000行超）の分割設計とファクト検証
- **決定事項 (Decision)**:
  1. \`data/f1KnowledgeData.ts\` などの巨大なデータファイルにおいて、歴史的データ（過去のチーム、ドライバー、マシン等）の拡張（Phase 5）を、元のファイルへの直接パッチではなく、新ファイル（例: \`f1HistoricalTeams.ts\`）に分割・モジュール化して実装するアーキテクチャ方針を決定。
  2. ルール正本（\`GEMINI.md\`）へ「巨大ファイルのモジュラー分割原則（3,000行ルール）」を正式に追記（v2.3.0）。
  3. 既存のダミー参考文献（架空の論文名など）を全削除し、ゼロ・ファブリケーション原則に従って公式情報源（Formula1.com, FIA.com）へ置換した。
- **背景・理由 (Rationale)**:
  約13,000行のTypeScriptファイルに対してAIエージェントが複数並列でテキスト置換やASTパッチを当てた結果、クオータエラーや大規模な構文破壊（コンマ抜け、カッコ不整合）が頻発したため。AI開発においては「人間が読める巨大ファイル」よりも「AIが破壊せずにパッチを当てられる細かい分割ファイル」の方が保守性が高いため。また、ダミーデータの残存はプロ向けポータルの信頼性を損なうため。
- **却下した代替案 (Rejected Alternatives)**:
  - 「既存の \`f1KnowledgeData.ts\` への正規表現による追記」: 厳密なTypeScriptオブジェクトの配列に対してテキストベースの追記は閉じカッコの誤認を招き、実際に構文エラーを引き起こしたため却下。

`;

const insertPos = dl.indexOf('## [2026');
dl = dl.slice(0, insertPos) + entry + dl.slice(insertPos);

fs.writeFileSync('DECISION_LOG.md', dl, 'utf-8');
console.log('Updated DECISION_LOG.md');
