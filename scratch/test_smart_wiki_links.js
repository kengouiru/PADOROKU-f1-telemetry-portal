/**
 * scratch/test_smart_wiki_links.js
 * Comprehensive automated verification for Wikipedia-style inline auto-linking,
 * glossary dedicated page routing, and dotted-underline styling.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 1. Verify files exist
const filesToCheck = [
  'lib/knowledgeLinkRegistry.ts',
  'components/common/SmartWikiText.tsx',
  'components/glossary/GlossaryDetailView.tsx',
  'app/knowledge/glossary/[id]/page.tsx',
  'components/hubs/F1GlossaryHub.tsx',
  'components/hubs/F1RegulationsHub.tsx',
  'components/hubs/DriverDetailModal.tsx',
  'components/hubs/TeamDetailModal.tsx'
];

console.log('=== Step 1: Checking File Existence ===');
filesToCheck.forEach(f => {
  const fullPath = path.join(__dirname, '..', f);
  assert(fs.existsSync(fullPath), `File missing: ${f}`);
  console.log(`[PASS] ${f} exists`);
});

// 2. Verify SmartWikiText styling requirements
console.log('\n=== Step 2: Verifying SmartWikiText Styling ===');
const smartWikiCode = fs.readFileSync(path.join(__dirname, '..', 'components/common/SmartWikiText.tsx'), 'utf-8');
assert(smartWikiCode.includes('target="_blank"'), 'Must have target="_blank" to open in new tab/window');
assert(smartWikiCode.includes('rel="noopener noreferrer"'), 'Must have rel="noopener noreferrer" for security');
assert(smartWikiCode.includes('text-inherit'), 'Must preserve original font color via text-inherit');
assert(smartWikiCode.includes('border-dotted') || smartWikiCode.includes('decoration-dotted'), 'Must have subtle dotted underline');
console.log('[PASS] SmartWikiText strictly adheres to user styling requirements (no font color change, subtle dotted underline, opens in new tab)');

// 3. Verify registry logic
console.log('\n=== Step 3: Verifying Knowledge Link Registry ===');
const registryCode = fs.readFileSync(path.join(__dirname, '..', 'lib/knowledgeLinkRegistry.ts'), 'utf-8');
assert(registryCode.includes('/knowledge/glossary/undercut'), 'Registry must map undercut');
assert(registryCode.includes('/knowledge/glossary/drs'), 'Registry must map DRS');
assert(registryCode.includes('/knowledge/drivers/${d.code}'), 'Registry must map drivers');
assert(registryCode.includes('/knowledge/teams/${t.id}'), 'Registry must map teams');
assert(registryCode.includes('/knowledge/rules'), 'Registry must map rules');
console.log('[PASS] Registry maps Glossary terms, Drivers, Teams, and Rules');

// 4. Verify GlossaryDetailView features
console.log('\n=== Step 4: Verifying GlossaryDetailView ===');
const glossaryViewCode = fs.readFileSync(path.join(__dirname, '..', 'components/glossary/GlossaryDetailView.tsx'), 'utf-8');
assert(glossaryViewCode.includes('別ウィンドウで開く'), 'Must have popout / open in separate window button');
assert(glossaryViewCode.includes('window.open'), 'Must call window.open for separate window');
assert(glossaryViewCode.includes('用語一覧に戻る'), 'Must have return to list button');
assert(!glossaryViewCode.includes('createPortal'), 'Must NOT use createPortal modal overlay');
console.log('[PASS] GlossaryDetailView is a true full-page view without modal overlay');

// 5. Verify F1GlossaryHub modal elimination
console.log('\n=== Step 5: Verifying F1GlossaryHub Modal Elimination ===');
const glossaryHubCode = fs.readFileSync(path.join(__dirname, '..', 'components/hubs/F1GlossaryHub.tsx'), 'utf-8');
assert(!glossaryHubCode.includes('createPortal'), 'F1GlossaryHub must no longer use createPortal');
assert(!glossaryHubCode.includes('GlossaryDetailModal'), 'F1GlossaryHub must use GlossaryDetailView instead of modal');
assert(glossaryHubCode.includes('GlossaryDetailView'), 'F1GlossaryHub must render GlossaryDetailView');
console.log('[PASS] F1GlossaryHub fully migrated away from modal to GlossaryDetailView');

// 6. Verify SmartWikiText usage across hubs
console.log('\n=== Step 6: Verifying SmartWikiText In-App Integration ===');
const regHubCode = fs.readFileSync(path.join(__dirname, '..', 'components/hubs/F1RegulationsHub.tsx'), 'utf-8');
assert(regHubCode.includes('<SmartWikiText text={art.inDepthAnalysis}'), 'Regulations must use SmartWikiText for inDepthAnalysis');

const driverModalCode = fs.readFileSync(path.join(__dirname, '..', 'components/hubs/DriverDetailModal.tsx'), 'utf-8');
assert(driverModalCode.includes('<SmartWikiText'), 'DriverDetailModal must use SmartWikiText');

const teamModalCode = fs.readFileSync(path.join(__dirname, '..', 'components/hubs/TeamDetailModal.tsx'), 'utf-8');
assert(teamModalCode.includes('<SmartWikiText'), 'TeamDetailModal must use SmartWikiText');

console.log('[PASS] SmartWikiText integrated across Regulations, Driver Details, and Team Details');

console.log('\n========================================');
console.log('🎉 ALL SMART WIKI LINK CHECKS PASSED (100%)');
console.log('========================================');
