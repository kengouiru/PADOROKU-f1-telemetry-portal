// Re-exporting all knowledge data from modularized files
export * from './f1KnowledgeTypes';
export { KNOWLEDGE_TEAMS } from './f1KnowledgeTeams';
export { KNOWLEDGE_DRIVERS } from './f1KnowledgeDrivers';
export { KNOWLEDGE_CIRCUITS } from './f1KnowledgeCircuits';
export { KNOWLEDGE_STRATEGIES } from './f1KnowledgeStrategies';
export { KNOWLEDGE_HISTORY } from './f1KnowledgeHistory';

import { KNOWLEDGE_TEAMS } from './f1KnowledgeTeams';
import { KNOWLEDGE_DRIVERS } from './f1KnowledgeDrivers';
import { HISTORICAL_TEAMS } from './f1HistoricalTeams';
import { HISTORICAL_DRIVERS } from './f1HistoricalDrivers';

KNOWLEDGE_TEAMS.push(...HISTORICAL_TEAMS);
KNOWLEDGE_DRIVERS.push(...HISTORICAL_DRIVERS);
