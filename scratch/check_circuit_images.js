const fs = require('fs');
const path = require('path');

const circuitIds = [
  'bahrain-international', 'suzuka', 'monza', 'spa-francorchamps', 'circuit-de-monaco',
  'silverstone', 'albert-park', 'shanghai', 'miami', 'imola', 'villeneuve', 'catalunya',
  'madrid', 'redbull-ring', 'hungaroring', 'zandvoort', 'baku', 'singapore', 'cota',
  'mexico', 'interlagos', 'las-vegas', 'losail', 'yas-marina', 'jeddah'
];

const imgDir = './public/images/circuits';
const allFiles = fs.readdirSync(imgDir);

circuitIds.forEach(id => {
  const norm = id.replace(/-/g, '_');
  const directMatches = allFiles.filter(f => f.includes(norm) || f.includes(id));
  console.log(`${id} => [${directMatches.join(', ')}]`);
});
