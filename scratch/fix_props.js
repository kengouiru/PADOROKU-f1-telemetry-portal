const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

text = text.replace(
  'isLive: boolean;',
  'isLive: boolean;\n  onOpenReview: () => void;'
).replace(
  'isLive,\n}:',
  'isLive,\n  onOpenReview,\n}:'
).replace(
  'onClick={() => setShowReviewModal(true)}',
  'onClick={onOpenReview}'
).replace(
  '<PreviousRaceHero \n          race={previousRace} \n          circuitId={getCircuitIdForRace(previousRace)} \n          isLive={false} \n        />',
  '<PreviousRaceHero \n          race={previousRace} \n          circuitId={getCircuitIdForRace(previousRace)} \n          isLive={false} \n          onOpenReview={() => setShowReviewModal(true)}\n        />'
);

fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
console.log('Fixed props in PreviousRaceHero');
