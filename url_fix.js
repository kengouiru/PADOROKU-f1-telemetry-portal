const fs = require('fs');
let fd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf8');

// Use a simple state machine to track the current id
let currentId = '';
const lines = fd.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (idMatch) {
        currentId = idMatch[1];
    }
    
    if (line.includes("url: 'https://www.formula1.com'") || line.includes("url: 'https://www.formula1.com/'")) {
        let newUrl = 'https://www.formula1.com';
        if (currentId) {
            // Check if it's likely a team or driver
            if (['red-bull', 'ferrari', 'mclaren', 'mercedes', 'aston-martin', 'alpine', 'williams', 'rb', 'sauber', 'haas', 'audi', 'cadillac'].includes(currentId)) {
                newUrl = `https://www.formula1.com/en/teams/${currentId}.html`;
            } else if (currentId.includes('-')) {
                newUrl = `https://www.formula1.com/en/drivers/${currentId}.html`;
            } else {
                newUrl = `https://www.formula1.com/en/latest/${currentId}.html`;
            }
        }
        lines[i] = line.replace(/url:\s*'https:\/\/www\.formula1\.com\/?'/, `url: '${newUrl}'`);
    }
}
fs.writeFileSync('data/f1KnowledgeData.ts', lines.join('\n'), 'utf8');
console.log('Replaced homepage URLs');
