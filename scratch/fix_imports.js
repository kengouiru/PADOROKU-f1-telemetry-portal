const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

// 1. Add imports
if (!text.includes('import { FlagIcon }')) {
  text = text.replace(/import AdSlot from '@\/components\/ads\/AdSlot';/, 
    "import AdSlot from '@/components/ads/AdSlot';\nimport { FlagIcon } from '../ui/FlagIcon';\nimport { PlayCircle } from 'lucide-react';");
}

// 2. Fix getAtmospherePhotos
// If it's a const arrow function, it's not hoisted. Let's find it and change it to a function declaration, or move it up.
if (text.includes('const getAtmospherePhotos =')) {
  text = text.replace(/const getAtmospherePhotos = \(circuitId: string, gpName: string\) => \{/, 'function getAtmospherePhotos(circuitId: string, gpName: string) {');
}

fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
console.log('Fixed imports and hoisting');
