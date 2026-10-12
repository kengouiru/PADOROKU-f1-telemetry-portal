const { execSync } = require('child_process');
const fs = require('fs');

try {
  const gitPath = 'C:\\Users\\kengo\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';
  const oldContent = execSync(`"${gitPath}" show 22b69d2:components/hubs/SeasonHub.tsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
  
  const lines = oldContent.split('\n');
  const activeTabLine = lines.find(l => l.includes('const [activeTab'));
  console.log('Old activeTab:', activeTabLine);
  
  const tabsIndex = lines.findIndex(l => l.includes('role="tablist"'));
  console.log('Old tabs:');
  console.log(lines.slice(tabsIndex, tabsIndex + 25).join('\n'));

  const heroIdx = lines.findIndex(l => l.includes('RACE HEADER') || l.includes('NEXT RACE'));
  console.log('Old Hero:');
  console.log(lines.slice(heroIdx, heroIdx + 40).join('\n'));
} catch (e) {
  console.error(e);
}
