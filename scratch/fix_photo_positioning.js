const fs = require('fs');

const path = 'components/hubs/SeasonHub.tsx';
let code = fs.readFileSync(path, 'utf-8');

const targetStr = `        {/* Cinematic Backdrop Photo: High-visibility vivid circuit atmosphere */}
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

const replacementStr = `        {/* Cinematic Backdrop Photo: High-visibility vivid circuit atmosphere */}
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

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync(path, code);
  console.log('Successfully adjusted photo to object-bottom with vivid night lighting!');
} else {
  console.error('Could not find targetStr');
}
