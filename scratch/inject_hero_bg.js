const fs = require('fs');

const path = 'components/hubs/SeasonHub.tsx';
const lines = fs.readFileSync(path, 'utf-8').split('\n');
const idx = lines.findIndex(l => l.includes('section className') && l.includes('rounded-2xl'));

if (idx !== -1) {
  // Replace the opening tag and add the background image container
  lines[idx] = `      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-4 sm:p-6 shadow-xl">
        {selectedAtmospherePhotos && selectedAtmospherePhotos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            <img 
              src={selectedAtmospherePhotos[0].url} 
              alt={selectedAtmospherePhotos[0].title} 
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/50 to-transparent" />
          </div>
        )}
        <div className="relative z-10">`;

  // We need to find where this section closes to add the closing </div>
  let closeIdx = -1;
  let depth = 1;
  for (let i = idx + 1; i < lines.length; i++) {
    if (lines[i].includes('<section')) depth++;
    if (lines[i].includes('</section>')) {
      depth--;
      if (depth === 0) {
        closeIdx = i;
        break;
      }
    }
  }

  if (closeIdx !== -1) {
    lines[closeIdx] = `        </div>\n      </section>`;
  }

  fs.writeFileSync(path, lines.join('\n'), 'utf-8');
  console.log('Successfully injected background image into SeasonHub hero section.');
} else {
  console.log('Could not find hero section opening tag.');
}
