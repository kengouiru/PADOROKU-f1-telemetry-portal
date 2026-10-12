const fs = require('fs');

['components/pitwall/PostRaceReviewModal.tsx', 'lib/openf1LiveResult.ts'].forEach(file => {
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(file, text, 'utf8');
});

console.log('Fixed backslashes');
