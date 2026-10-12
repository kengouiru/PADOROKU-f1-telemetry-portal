const fs = require('fs');
let rule = fs.readFileSync('GEMINI.md', 'utf-8');

rule = rule.replace(
  '- **v2.2.0 (2026-10-04)**:',
  `- **v2.3.0 (2026-10-05)**:
  - 第1部第5条「巨大ファイルのモジュラー分割原則」を追加。AIエージェントのコンテキスト溢れや構文破損を防ぐため、3,000行を超えるデータファイルやコンポーネントは分割を義務化。
- **v2.2.0 (2026-10-04)**:`
);

const newRule = `### 5. 巨大ファイルのモジュラー分割原則 (Modular Architecture for AI)
- **3,000行ルール**: コンポーネントやデータファイル（特にTypeScriptの静的データ配列）が3,000行を超えた場合、AIエージェントによる一括パッチ適用時にASTや正規表現が破損するリスクが跳ね上がる。
- 巨大なファイルに遭遇した場合、直接パッチを当てる前に、論理的な境界でファイルを分割（例: \`f1KnowledgeData.ts\` を \`f1CurrentTeams.ts\` と \`f1HistoricalTeams.ts\` に分割して re-export する等）するリファクタリングを優先すること。
`;

rule = rule.replace(
  '### 4. 作業記録（議事録 / Worklog）の記録義務',
  newRule + '\n### 4. 作業記録（議事録 / Worklog）の記録義務'
);

fs.writeFileSync('GEMINI.md', rule, 'utf-8');
