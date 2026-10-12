const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

text = text.replace(
  /\/\/ TODO: Phase B/g,
  'TODO: Phase B'
);

fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
console.log('Fixed comment in JSX');
