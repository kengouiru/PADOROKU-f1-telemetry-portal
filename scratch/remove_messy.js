const fs = require('fs');
let kd = fs.readFileSync('data/f1KnowledgeData.ts', 'utf-8');

// The objects I added were right at the beginning of the arrays.
// For Team Lotus:
const teamStart = kd.indexOf("  {\n    id: 'team-lotus'");
if (teamStart !== -1) {
  const teamEnd = kd.indexOf("  },", teamStart) + 4;
  kd = kd.slice(0, teamStart) + kd.slice(teamEnd);
}

// For Jim Clark:
const driverStart = kd.indexOf("  {\n    code: 'CLK'");
if (driverStart !== -1) {
  const driverEnd = kd.indexOf("  },", driverStart) + 4;
  kd = kd.slice(0, driverStart) + kd.slice(driverEnd);
}

fs.writeFileSync('data/f1KnowledgeData.ts', kd, 'utf-8');
console.log('Removed messy additions');
