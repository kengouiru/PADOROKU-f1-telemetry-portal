const fs = require('fs');
let text = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf8');

if (text.includes('getAtmospherePhotos(circuitId')) {
  text = text.replace(/getAtmospherePhotos\(circuitId/g, 'getCircuitAtmospherePhotos(circuitId');
  fs.writeFileSync('components/hubs/SeasonHub.tsx', text, 'utf8');
  console.log('Fixed getCircuitAtmospherePhotos');
}
