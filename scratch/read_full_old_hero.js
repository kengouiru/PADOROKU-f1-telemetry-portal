const { execSync } = require('child_process');
const fs = require('fs');

const gitPath = 'C:\\Users\\kengo\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';
const oldContent = execSync(`"${gitPath}" show 22b69d2:components/hubs/SeasonHub.tsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
const lines = oldContent.split('\n');

const heroIdx = lines.findIndex(l => l.includes('NEXT RACE HERO'));
const nextSectionIdx = lines.findIndex(l => l.includes('2. SUB-NAVIGATION TABS') || l.includes('SECTION TABS') || l.includes('role="tablist"'));
console.log('Hero start:', heroIdx, 'Next section:', nextSectionIdx);
console.log(lines.slice(heroIdx, nextSectionIdx).join('\n'));
