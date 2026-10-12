const { execSync } = require('child_process');
const fs = require('fs');

const gitPath = 'C:\\Users\\kengo\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';
const oldContent = execSync(`"${gitPath}" show 22b69d2:components/hubs/SeasonHub.tsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
const lines = oldContent.split('\n');

const heroStart = lines.findIndex(l => l.includes('NEXT RACE HERO'));
const navTabsStart = lines.findIndex(l => l.includes('2. SUB-NAVIGATION TABS') || l.includes('2. NAVIGATION TABS'));

console.log('Old hero start:', heroStart, 'nav tabs start:', navTabsStart);

const oldHeroCode = lines.slice(heroStart - 1, navTabsStart).join('\n');
fs.writeFileSync('scratch/old_hero_extracted.tsx', oldHeroCode, 'utf-8');
console.log('Saved old hero extracted code. Length:', oldHeroCode.length);
