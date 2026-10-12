const fs = require('fs');
let content = fs.readFileSync('components/AIStrategist.tsx', 'utf8');

// The file has literal newlines inside single quotes because of my stupid global replace.
// Let's replace the single quotes with backticks around the specific text blocks.
// I will just use regex to match the broken string literal and change it to backticks.
const brokenString1 = `'**本日のAI戦略相談枠（無料分）の上限に達しました**
ヘッダーの「+2回」ボタンから公式スポンサー案内を視聴すると質問枠を即座に回復できます。
また、回数無制限で活用するには**「Pitwall Pro」**へアップグレードしてください。'`;

const fixedString1 = `\`**本日のAI戦略相談枠（無料分）の上限に達しました**\n\nヘッダーの「+2回」ボタンから公式スポンサー案内を視聴すると質問枠を即座に回復できます。\nまた、回数無制限で活用するには**「Pitwall Pro」**へアップグレードしてください。\``;

content = content.replace(brokenString1, fixedString1);

const brokenString2 = `\`エラー: \${msg}

Gemini API接続に問題が発生しました。しばらく時間を置いてお試しください。\``;

const fixedString2 = `\`エラー: \${msg}\\n\\nGemini API接続に問題が発生しました。しばらく時間を置いてお試しください。\``;

content = content.replace(brokenString2, fixedString2);

// Check if there are other single-quoted strings that were broken.
// We can just look for them.
// "エラー: ${msg}\n\nGemini API接続に問題が発生しました。しばらく時間を置いてお試しください。" was already a template literal so maybe it's fine.

fs.writeFileSync('components/AIStrategist.tsx', content, 'utf8');
console.log('Fixed broken string literals.');
