const fs = require('fs');
const file = 'components/AIStrategist.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Toggle Labels
content = content.replace(
  /📚 2026 FIA Regulations \(Ultra\)/g,
  '📚 2026 FIA Regulations <span className="text-[10px] bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1.5 py-0.5 rounded font-black tracking-wider shadow-[0_0_5px_rgba(251,191,36,0.6)] ml-1">PRO</span>'
);
content = content.replace(
  /📚 Ultra/g,
  '📚 <span className="text-[9px] bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1 py-0.5 rounded font-black shadow-[0_0_5px_rgba(251,191,36,0.6)] ml-1">PRO</span>'
);

// Replace Raw Button
content = content.replace(
  /📊<span className="hidden sm:inline">生データを含めて送信<\/span>/g,
  '📊<span className="hidden sm:inline">生データを含めて送信</span><span className="ml-1 text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 px-1 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.5)] tracking-wide">PRO</span>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Updated AIStrategist.tsx with PRO badges.');
