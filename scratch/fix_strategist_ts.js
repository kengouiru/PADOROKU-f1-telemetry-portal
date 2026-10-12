const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/api/strategist/route.ts');
let code = fs.readFileSync(filePath, 'utf-8');

// Fix imports
code = code.replace("import { F1_REGULATIONS } from '@/data/f1RegulationsData';", "import { REGULATION_ARTICLES } from '@/data/f1RegulationsData';");
code = code.replace("import { TYRE_COMPOUNDS, PIRELLI_HARDNESS } from '@/data/tyreEncyclopediaData';", "import { TYRE_COMPOUNDS, PIRELLI_COMPOUNDS } from '@/data/tyreEncyclopediaData';");

// Fix JSON.stringify variables and any types
code = code.replace("F1_REGULATIONS.filter(r => r.category", "REGULATION_ARTICLES.filter((r: any) => r.category");
code = code.replace("JSON.stringify(PIRELLI_HARDNESS)", "JSON.stringify(PIRELLI_COMPOUNDS)");

fs.writeFileSync(filePath, code);
console.log('Successfully fixed errors in strategist route.ts');
