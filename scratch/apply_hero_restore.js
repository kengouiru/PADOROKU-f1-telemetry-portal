const fs = require('fs');

let oldHero = fs.readFileSync('scratch/old_hero_extracted.tsx', 'utf-8');

// Fix title -> tag in oldHero
oldHero = oldHero.replace(/title: `\${toJapaneseGpName\(selectedRace\.gpName\)} - \${selectedAtmospherePhotos\[0\]\.tag}`/g, 'tag: `${toJapaneseGpName(selectedRace.gpName)} - ${selectedAtmospherePhotos[0].tag}`');
oldHero = oldHero.replace(/title: `\${toJapaneseGpName\(selectedRace\.gpName\)} - \${selectedAtmospherePhotos\[1\]\.tag}`/g, 'tag: `${toJapaneseGpName(selectedRace.gpName)} - ${selectedAtmospherePhotos[1].tag}`');

// Read current SeasonHub.tsx
let currentHub = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf-8');
const lines = currentHub.split('\n');

const start = lines.findIndex(l => l.includes('1. RACE HEADER') || l.includes('1. NEXT RACE HERO'));
const end = lines.findIndex(l => l.includes('SECTION TABS') || l.includes('role="tablist"'));

console.log('Replacing lines from', start, 'to', end);

// Also set activeTab default to 'calendar'
currentHub = currentHub.replace(
  "const [activeTab, setActiveTab] = useState<MainTab>('track_analysis');",
  "const [activeTab, setActiveTab] = useState<MainTab>('calendar');"
);

// Re-split
const newLines = currentHub.split('\n');
const startIdx = newLines.findIndex(l => l.includes('1. RACE HEADER') || l.includes('1. NEXT RACE HERO'));
const endIdx = newLines.findIndex(l => l.includes('SECTION TABS') || l.includes('role="tablist"'));

// Replace section
const before = newLines.slice(0, startIdx);
const after = newLines.slice(endIdx);

const updatedContent = before.join('\n') + '\n' + oldHero + '\n' + after.join('\n');

fs.writeFileSync('components/hubs/SeasonHub.tsx', updatedContent, 'utf-8');
console.log('Successfully replaced broken hero section with authentic 2-column hero layout!');
