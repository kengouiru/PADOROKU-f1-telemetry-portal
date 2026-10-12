const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

// Import FlagIcon
if (!text.includes('import { FlagIcon }')) {
    text = text.replace(/import\s*\{\s*Calendar.*\}\s*from\s*'lucide-react';/, "import { Calendar, ChevronRight, ChevronLeft, Map, Clock, Trophy, Car, Users, Search, PlayCircle } from 'lucide-react';\nimport { FlagIcon } from '../ui/FlagIcon';");
}

// Replace emoji span with FlagIcon
const target = '<span className="text-sm sm:text-base">{gp.flag}</span>';
const replacement = '<FlagIcon emojiFlag={gp.flag} className="w-5 h-3.5 sm:w-6 sm:h-4 shadow-sm" />';
if (text.includes(target)) {
    text = text.replace(target, replacement);
    fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
    console.log('Replaced flag with FlagIcon');
} else {
    console.log('Target not found for flag replacement');
}
