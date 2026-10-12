const fs = require('fs');
let lines = fs.readFileSync('components/AIStrategist.tsx', 'utf8').split('\n');

lines = lines.map(line => {
  if (line.includes("'**本日のAI戦略相談枠（無料分）の上限に達しました**")) {
    return line.replace(/'\*\*本日のAI戦略相談枠（無料分）の上限に達しました\*\*/, "`**本日のAI戦略相談枠（無料分）の上限に達しました**");
  }
  if (line.includes("また、回数無制限で活用するには**「Pitwall Pro」**へアップグレードしてください。'")) {
    return line.replace(/また、回数無制限で活用するには\*\*「Pitwall Pro」\*\*へアップグレードしてください。'/, "また、回数無制限で活用するには**「Pitwall Pro」**へアップグレードしてください。`");
  }
  return line;
});

fs.writeFileSync('components/AIStrategist.tsx', lines.join('\n'), 'utf8');
console.log('Fixed quotes.');
