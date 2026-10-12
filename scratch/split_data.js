const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'data', 'f1KnowledgeData.ts');
const content = fs.readFileSync(srcPath, 'utf8');
const lines = content.split('\n');

// Find boundaries
const idxTeams = lines.findIndex(l => l.startsWith('export const KNOWLEDGE_TEAMS'));
const idxDrivers = lines.findIndex(l => l.startsWith('export const KNOWLEDGE_DRIVERS'));
const idxCircuits = lines.findIndex(l => l.startsWith('export const KNOWLEDGE_CIRCUITS'));
const idxStrategies = lines.findIndex(l => l.startsWith('export const KNOWLEDGE_STRATEGIES'));
const idxHistory = lines.findIndex(l => l.startsWith('export const KNOWLEDGE_HISTORY'));

const typesContent = lines.slice(0, idxTeams).join('\n');
const teamsContent = lines.slice(idxTeams, idxDrivers).join('\n');
const driversContent = lines.slice(idxDrivers, idxCircuits).join('\n');
const circuitsContent = lines.slice(idxCircuits, idxStrategies).join('\n');
const strategiesContent = lines.slice(idxStrategies, idxHistory).join('\n');
const historyContent = lines.slice(idxHistory).join('\n');

// Write out split files
fs.writeFileSync(path.join(__dirname, '..', 'data', 'f1KnowledgeTypes.ts'), typesContent);

const importsHeader = `import { 
  TeamProfile, DriverProfile, CircuitProfile, 
  StrategyConcept, HistoryArchive 
} from './f1KnowledgeTypes';\n\n`;

const typesImportsHeader = `import * as Types from './f1KnowledgeTypes';\n\n`;

// Since the arrays use these types, we need to import them.
// Let's just import everything from f1KnowledgeTypes to be safe, or specific types.
// A simpler way: just import all types.
const allTypesImport = `import { 
  TeamProfile, DriverProfile, CircuitProfile, 
  StrategyConcept, HistoryArchive,
  TyreKnowledge, Reference, TeamIconicCar, DriverMilestone, IconicRace,
  DriverVisualAsset, VisualGalleryItem, EngineeringPreference, RaceEngineer,
  DriverSocialLinks, DriverSeasonHistory, TelemetryTarget, EmbeddedRadio,
  KeyCorner, CircuitCornerDetail, TrackGeometry, CircuitVisualAsset,
  CircuitHistoricalMoment, CircuitOfficialLinks, CircuitVisualMap
} from './f1KnowledgeTypes';\n
import { SeasonStoryline, Rivalry, DramaticMoment, PaddockRelationship } from './f1DramaData';
import { DriverTraitId, DriverTraitDefinition, TraitTier, TraitCategory } from './driverTraitsData';\n\n`;

fs.writeFileSync(path.join(__dirname, '..', 'data', 'f1KnowledgeTeams.ts'), allTypesImport + teamsContent);
fs.writeFileSync(path.join(__dirname, '..', 'data', 'f1KnowledgeDrivers.ts'), allTypesImport + driversContent);
fs.writeFileSync(path.join(__dirname, '..', 'data', 'f1KnowledgeCircuits.ts'), allTypesImport + circuitsContent);
fs.writeFileSync(path.join(__dirname, '..', 'data', 'f1KnowledgeStrategies.ts'), allTypesImport + strategiesContent);
fs.writeFileSync(path.join(__dirname, '..', 'data', 'f1KnowledgeHistory.ts'), allTypesImport + historyContent);

// Rewrite f1KnowledgeData.ts to act as a barrel/facade
const newMainContent = `// Re-exporting all knowledge data from modularized files
export * from './f1KnowledgeTypes';
export { KNOWLEDGE_TEAMS } from './f1KnowledgeTeams';
export { KNOWLEDGE_DRIVERS } from './f1KnowledgeDrivers';
export { KNOWLEDGE_CIRCUITS } from './f1KnowledgeCircuits';
export { KNOWLEDGE_STRATEGIES } from './f1KnowledgeStrategies';
export { KNOWLEDGE_HISTORY } from './f1KnowledgeHistory';
`;
fs.writeFileSync(srcPath, newMainContent);

console.log("Splitting complete!");
