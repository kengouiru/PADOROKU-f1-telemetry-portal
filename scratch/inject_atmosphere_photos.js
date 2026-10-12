const fs = require('fs');
const path = 'components/hubs/SeasonHub.tsx';
let lines = fs.readFileSync(path, 'utf-8').split('\n');

const searchStr = 'onOpen3dModal={() => setIs3dModalOpen(true)}';
const mapEndIdx = lines.findIndex(l => l.includes(searchStr));

if (mapEndIdx !== -1) {
  // We need to find the `/>` closing tag for HeroTrackMapCard
  let insertIdx = mapEndIdx + 1;
  while (insertIdx < lines.length && !lines[insertIdx].includes('/>')) {
    insertIdx++;
  }
  
  if (lines[insertIdx].includes('/>')) {
    insertIdx++; // Insert AFTER the `/>` line

    const snippet = `
        {/* Atmosphere Photos */}
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="flex flex-col gap-2">
            {selectedAtmospherePhotos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAtmosphereModalImage(photo)}
                className="group relative w-full h-24 rounded-xl overflow-hidden border border-white/10 hover:border-slate-300/50 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                  <p className="text-[10px] font-racing text-slate-300 opacity-80 group-hover:text-red-300 transition-colors uppercase tracking-widest leading-none mb-0.5">
                    {i === 0 ? 'GRAND PRIX VIBES' : 'TRACK ATMOSPHERE'}
                  </p>
                  <p className="text-xs font-bold text-white truncate drop-shadow-md">
                    {photo.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
`;
    // Insert into the right column (inside the section, but after HeroTrackMapCard)
    // Actually wait, we need to wrap HeroTrackMapCard and Atmosphere Photos in a div so they stay in the right column together!
    // Let's modify the structure around HeroTrackMapCard.
    
    // Find where HeroTrackMapCard starts:
    let mapStartIdx = insertIdx;
    while (mapStartIdx >= 0 && !lines[mapStartIdx].includes('<HeroTrackMapCard')) {
      mapStartIdx--;
    }
    
    lines.splice(mapStartIdx, 0, '        <div className="flex flex-col gap-4">');
    lines.splice(insertIdx + 2, 0, snippet, '        </div>'); // insertIdx + 2 because we added a line before it
    
    fs.writeFileSync(path, lines.join('\n'), 'utf-8');
    console.log('Successfully added Atmosphere Photos below Track Map.');
  } else {
    console.log('Could not find /> for HeroTrackMapCard.');
  }
} else {
  console.log('Could not find onOpen3dModal string.');
}
