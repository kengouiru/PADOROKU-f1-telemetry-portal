const path = require('path');

// We can test importing directly or calling node with tsx / compiling,
// or test getHistoricalRaceResults from the compiled JS or ts-node/register,
// or test directly with node by reading f1HistoricalResultsData.ts
const fs = require('fs');

async function test() {
  const code = fs.readFileSync('data/f1HistoricalResultsData.ts', 'utf8');
  console.log('f1HistoricalResultsData.ts size:', code.length, 'bytes');
  
  // Test 2022 R1 in the data
  const has2022R1 = code.includes('"Bahrain Grand Prix"');
  console.log('Contains Bahrain Grand Prix:', has2022R1);

  // Test 2018 R1 in the data
  const has2018R1 = code.includes('"Australian Grand Prix"');
  console.log('Contains Australian Grand Prix:', has2018R1);
}

test().catch(console.error);
