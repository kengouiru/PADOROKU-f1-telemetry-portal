const fs = require('fs');

const content = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

const matches = [...content.matchAll(/id:\s*'([a-z0-9-]+)'[\s\S]*?code:\s*'([A-Z0-9]+)'[\s\S]*?fullName:\s*'([^']+)'[\s\S]*?imageUrl:\s*'([^']+)'/g)];

console.log(`Found ${matches.length} drivers`);
matches.forEach(m => {
  const [, id, code, name, img] = m;
  const exists = fs.existsSync('public' + img) || fs.existsSync(img.replace(/^\//, 'public/'));
  console.log(`${code.padEnd(4)} | ${name.padEnd(25)} | ${img.padEnd(50)} | exists: ${exists}`);
});
