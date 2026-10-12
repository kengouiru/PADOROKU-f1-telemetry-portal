const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');
text = text.replace(
  "{raceResultView ? \\\\年 決勝結果\\ : '前回大会の結果（2024年・同サーキット）'}",
  "{raceResultView ? \\\\年 \\\\ : '前回大会の結果（2024年・同サーキット）'}"
);
fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
console.log('Updated SeasonHub.tsx heading');
