const { execSync } = require('child_process');
const fs = require('fs');

try {
  const gitPath = 'C:\\Users\\kengo\\AppData\\Local\\GitHubDesktop\\app-3.6.6\\resources\\app\\git\\cmd\\git.exe';
  const oldContent = execSync(`"${gitPath}" show 22b69d2:components/hubs/SeasonHub.tsx`, { maxBuffer: 10 * 1024 * 1024 }).toString('utf-8');
  
  const lines = oldContent.split('\n');
  const returnIdx = lines.findIndex(l => l.includes('return (') && l.includes('space-y'));
  
  // print next 150 lines from return
  console.log(lines.slice(returnIdx, returnIdx + 150).join('\n'));
} catch (e) {
  console.error(e);
}
