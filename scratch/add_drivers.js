const fs = require('fs');
let content = fs.readFileSync('lib/sessionResultsService.ts', 'utf-8');

const tsStr = `  TSU: { code: 'TSU', name: '角田裕毅', number: 22, team: 'Red Bull Racing', color: '#001A30' },
  LIN: { code: 'LIN', name: 'アルヴィド・リンドブラッド', number: 33, team: 'Visa Cash App RB', color: '#1B35D1' },`;
  
content = content.replace(/const GRID_2026_MAP.*?: Record<string, GridDriverDef> = \{/, 
  'const GRID_2026_MAP: Record<string, GridDriverDef> = {\n' + tsStr);

fs.writeFileSync('lib/sessionResultsService.ts', content, 'utf-8');
console.log('Added TSU and LIN to GRID_2026_MAP');
