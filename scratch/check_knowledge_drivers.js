const fs = require('fs');

const content = fs.readFileSync('./data/f1KnowledgeData.ts', 'utf8');
const lines = content.split('\n');

const drivers = [];
let currentDriver = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("id: '") || line.includes('id: "')) {
    const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
    if (idMatch) {
      currentDriver = { id: idMatch[1], line: i + 1 };
    }
  }
  if (currentDriver) {
    const codeMatch = line.match(/code:\s*['"]([^'"]+)['"]/);
    if (codeMatch) currentDriver.code = codeMatch[1];
    
    const nameMatch = line.match(/fullName:\s*['"]([^'"]+)['"]/);
    if (nameMatch) currentDriver.fullName = nameMatch[1];

    const statusMatch = line.match(/status:\s*['"]([^'"]+)['"]/);
    if (statusMatch) currentDriver.status = statusMatch[1];

    const numMatch = line.match(/number:\s*(\d+)/);
    if (numMatch && !currentDriver.number) currentDriver.number = parseInt(numMatch[1]);

    if (line.trim() === '},' || line.trim() === '}') {
      if (currentDriver.code && currentDriver.fullName) {
        drivers.push(currentDriver);
        currentDriver = null;
      }
    }
  }
}

console.log('Found drivers in f1KnowledgeData.ts:', drivers.length);
drivers.forEach(d => console.log(`[Line ${d.line}] ${d.code} (#${d.number}): ${d.fullName} | Status: ${d.status}`));
