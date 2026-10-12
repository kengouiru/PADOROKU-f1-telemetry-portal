const fs = require('fs');
let code = fs.readFileSync('components/hubs/SeasonHub.tsx', 'utf-8');

code = code.replace(
  '{selectedWeather.humidity}% / {selectedWeather.pressureHpa}hPa',
  '{selectedWeather.humidity}%'
);
code = code.replace(
  '湿度 / 気圧',
  '湿度 (Humidity)'
);
code = code.replace(
  '{selectedWeather.conditionJa}',
  '{selectedWeather.conditionText}'
);

fs.writeFileSync('components/hubs/SeasonHub.tsx', code);
console.log('Fixed weather properties.');
