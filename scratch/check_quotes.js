const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8').split('\n');
text.forEach((l, i) => {
    const q = (l.match(/"/g) || []).length;
    if (q % 2 !== 0) console.log(i + 1, l.trim());
});
