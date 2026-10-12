const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

if (!text.includes('PostRaceReviewModal')) {
  text = "import { PostRaceReviewModal } from '../pitwall/PostRaceReviewModal';\n" + text;
  
  text = text.replace(
    'const [showAIInsights, setShowAIInsights] = useState(false);',
    'const [showAIInsights, setShowAIInsights] = useState(false);\n  const [showReviewModal, setShowReviewModal] = useState(false);'
  );
  
  text = text.replace(
    /<button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white\/10 text-xs font-bold font-racing flex items-center gap-2 transition-all opacity-50 cursor-not-allowed">/g,
    '<button onClick={() => setShowReviewModal(true)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-white/10 text-xs font-bold font-racing flex items-center gap-2 transition-all cursor-pointer">'
  );
  
  text = text.replace(
    /<span className="px-2 py-1 bg-amber-500\/20 text-amber-300 border border-amber-500\/30 rounded text-\[9px\] font-bold">\s*TODO: Phase B\s*<\/span>/,
    '' // Remove the TODO Phase B span
  );
  
  text = text.replace(
    '{/* Modals */}',
    '{/* Modals */}\n      {showReviewModal && previousRace && (\n        <PostRaceReviewModal\n          round={previousRace.round}\n          onClose={() => setShowReviewModal(false)}\n        />\n      )}'
  );

  fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
  console.log('Updated SeasonHub.tsx to include PostRaceReviewModal');
}
