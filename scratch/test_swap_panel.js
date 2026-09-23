const fs = require('fs');

const original = fs.readFileSync('components/hubs/race-simulator/cockpit/TacticalCommandsPanel.tsx', 'utf8');
const lines = original.split(/\r?\n/);

// Lines 0 to 130: Header + imports + component setup
const pre = lines.slice(0, 131).join('\n');

// Radio prompt lines: 135 to 205 (0-indexed: 134 to 205)
const radioPromptLines = lines.slice(134, 205).map(l => {
  if (l.includes('absolute inset-0 z-30')) {
    return l.replace('absolute inset-0 z-30', 'relative z-30 mb-2');
  }
  return l;
}).join('\n');

// Commands card lines: 433 to 843 (0-indexed: 433 to 843)
const commandsCard = lines.slice(433, 843).join('\n');

// Intel card lines: 206 to 431 (0-indexed: 206 to 431)
const intelCardInner = lines.slice(206, 431).join('\n');

const newContent = `${pre}
  return (
    <div className={\`w-full min-w-0 space-y-2.5 \${mobileConsoleView === 'comms' || mobileConsoleView === 'integrated' ? 'block' : 'hidden lg:block'}\`}>
      {/* ── 1. ACTIVE EMERGENCY RADIO PROMPT (Prominent Alert Above Commands) ── */}
${radioPromptLines}

      {/* ── 2. DOCKED PIT STRATEGY & TACTICAL COMMANDS (Unified Single Card) ── */}
${commandsCard}

      {/* ── 3. MISSION CONTROL INTEL (Rival Espionage & Shared Analytics) ── */}
      <div className={\`glass-card-premium p-2.5 sm:p-3 rounded-2xl border border-white/10 shadow-lg backdrop-blur-md flex flex-col h-[388px] relative overflow-hidden \${mobileConsoleView === 'integrated' ? 'hidden lg:flex' : 'flex'}\`}>
${intelCardInner}
      </div>
    </div>
  );
};

export default TacticalCommandsPanel;
`;

fs.writeFileSync('components/hubs/race-simulator/cockpit/TacticalCommandsPanel.tsx', newContent);
console.log('Updated components/hubs/race-simulator/cockpit/TacticalCommandsPanel.tsx');
