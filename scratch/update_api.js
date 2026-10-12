const fs = require('fs');
let text = fs.readFileSync('lib/openf1Api.ts', 'utf8');

text = text.replace(
  /export async function fetchTeamRadio\(\s*sessionKey: number,\s*driverNumber: number\s*\): Promise<TeamRadio\[]> {/m,
  'export async function fetchTeamRadio(\n  sessionKey: number,\n  driverNumber?: number\n): Promise<TeamRadio[]> {'
);

text = text.replace(
  /toProxyUrl\('team_radio', `session_key=\$\{sessionKey\}&driver_number=\$\{driverNumber\}`\)/,
  "toProxyUrl('team_radio', `session_key=${sessionKey}${driverNumber ? `&driver_number=${driverNumber}` : ''}`)"
);

fs.writeFileSync('lib/openf1Api.ts', text, 'utf8');
console.log('Updated fetchTeamRadio to allow optional driverNumber');
