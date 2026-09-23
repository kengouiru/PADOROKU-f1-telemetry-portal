const fs = require('fs');

const filePath = 'components/hubs/race-simulator/cockpit/TacticalCommandsPanel.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// Find marker positions
const startContainer = content.indexOf('<div className={`w-full min-w-0 space-y-2.5 ${mobileConsoleView === \'comms\'');
if (startContainer === -1) {
  console.error('Could not find startContainer');
  process.exit(1);
}

const radioPromptStart = content.indexOf('{/* 1. Active Radio Prompt Overlay', startContainer);
const headerIntelStart = content.indexOf('{/* Header */\n            <div className="flex flex-wrap items-center justify-between', radioPromptStart);
const commandsStart = content.indexOf('{/* ── DOCKED PIT STRATEGY & TACTICAL COMMANDS', headerIntelStart);
const commandsEnd = content.indexOf('</div>\n        </div>\n\n  );', commandsStart);

console.log('Markers:', {
  startContainer,
  radioPromptStart,
  headerIntelStart,
  commandsStart,
  commandsEnd
});
