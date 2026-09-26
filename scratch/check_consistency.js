const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f === 'node_modules' || f === '.next' || f === '.git' || f === 'scratch') continue;
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      const content = fs.readFileSync(p, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('アントネッリ') && (line.includes('勝') || line.includes('pt') || line.includes('ポイント'))) {
          console.log(`${p}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

walk('.');
