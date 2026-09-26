const fs = require('fs');

const dir = './public/images/circuits';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.endsWith('.jpg') || f.endsWith('.png')) {
    const stats = fs.statSync(`${dir}/${f}`);
    console.log(`${f.padEnd(35)} ${Math.round(stats.size/1024)} KB`);
  }
});
