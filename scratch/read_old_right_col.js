const { execSync } = require('child_process');
const fs = require('fs');

const gitPath = 'C:\\Users\\kengo\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';
const oldContent = execSync(`"${gitPath}" show 22b69d2:components/hubs/SeasonHub.tsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
const lines = oldContent.split('\n');

const rightColIdx = lines.findIndex(l => l.includes('Right Column:') || l.includes('Countdown & Live Status'));
console.log('Right column:');
console.log(lines.slice(rightColIdx, rightColIdx + 90).join('\n'));
