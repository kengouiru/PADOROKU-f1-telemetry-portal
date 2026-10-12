const fs = require('fs');
const path = 'components/hubs/SeasonHub.tsx';
let lines = fs.readFileSync(path, 'utf-8').split('\n');
const idx = lines.findIndex(l => l.includes('section className') && l.includes('relative overflow-hidden'));

if (idx !== -1) {
  lines[idx] = `      <section className="relative overflow-hidden rounded-2xl border border-white/15 bg-slate-950 p-5 sm:p-8 shadow-2xl">
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].title} 
              className="w-full h-full object-cover opacity-50" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>
        )}`;
  fs.writeFileSync(path, lines.join('\n'), 'utf-8');
  console.log('Fixed opacity and gradients for better visibility.');
}
