const { execSync } = require('child_process');
const fs = require('fs');

const gitPath = 'C:\\Users\\kengo\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';
const oldContent = execSync(`"${gitPath}" show 22b69d2:components/hubs/SeasonHub.tsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
const lines = oldContent.split('\n');

const heroStart = lines.findIndex(l => l.includes('1. NEXT RACE HERO & DUAL-TIME'));
const heroEnd = lines.findIndex(l => l.includes('2. SUB-NAVIGATION TABS') || l.includes('Official Broadcast Partner'));
console.log('Hero range:', heroStart, 'to', heroEnd);
console.log(lines.slice(heroStart, heroStart + 120).join('\n'));
