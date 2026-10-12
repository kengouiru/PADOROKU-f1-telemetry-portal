const fs = require('fs');

const path = 'components/hubs/SeasonHub.tsx';
let code = fs.readFileSync(path, 'utf-8');

// Replace the backdrop photo and overlays
const oldBackdrop = `        {/* Cinematic Backdrop Photo with Layered Scrim */}
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].tag} 
              className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out" 
            />
            {/* Horizontal scrim: Darkens left side for crystal-clear text readability while revealing track visual */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/45" />
            {/* Vertical scrim: Protects bottom timetable and adds cinematic vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            {/* Subtle atmospheric glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          </div>
        )}`;

const newBackdrop = `        {/* Cinematic Backdrop Photo: High-visibility vivid circuit atmosphere */}
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].tag} 
              className="w-full h-full object-cover object-center opacity-85 brightness-90 contrast-105" 
            />
            {/* Lightweight gradient overlay: Keeps photos vibrant while providing soft text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
          </div>
        )}`;

if (code.includes(oldBackdrop)) {
  code = code.replace(oldBackdrop, newBackdrop);
  fs.writeFileSync(path, code);
  console.log('Successfully updated backdrop to vivid visible photo!');
} else {
  console.error('Could not find oldBackdrop');
}
