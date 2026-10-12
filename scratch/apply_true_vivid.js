const fs = require('fs');

const path = 'components/hubs/SeasonHub.tsx';
let code = fs.readFileSync(path, 'utf-8');

// Replace backdrop with truly transparent overlays and high brightness
const targetBackdrop = `        {/* Cinematic Backdrop Photo: High-visibility vivid circuit atmosphere */}
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].tag} 
              className="w-full h-full object-cover object-bottom opacity-90 brightness-110 contrast-110 saturate-125 scale-100" 
            />
            {/* Soft gradient: Preserves gorgeous night reflections while maintaining text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/30" />
          </div>
        )}`;

const newBackdrop = `        {/* Cinematic Backdrop Photo: Truly visible night skyline */}
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].tag} 
              className="w-full h-full object-cover object-center opacity-100 brightness-125 contrast-120 saturate-140" 
            />
            {/* Very minimal subtle vignette just to soften borders, NOT blacking out the center */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </div>
        )}`;

if (code.includes(targetBackdrop)) {
  code = code.replace(targetBackdrop, newBackdrop);
}

// Make timetable cards truly semi-transparent ghost style so background shines through!
code = code.replace(
  "bg-slate-950/65 hover:bg-slate-900/80 border-white/10 hover:border-sky-500/40 shadow-md",
  "bg-black/35 hover:bg-black/60 border-white/20 hover:border-sky-400/60 backdrop-blur-sm shadow-lg"
);
code = code.replace(
  "bg-gradient-to-b from-red-950/65 via-slate-950/80 to-slate-950/95 border-red-500/50 hover:border-red-400 shadow-lg shadow-red-950/30 ring-1 ring-red-500/30 hover:shadow-red-900/40",
  "bg-red-950/40 hover:bg-red-950/60 border-red-500/60 hover:border-red-400 backdrop-blur-sm shadow-xl ring-1 ring-red-500/40"
);

fs.writeFileSync(path, code);
console.log('Applied truly visible backdrop and ghost glass cards!');
