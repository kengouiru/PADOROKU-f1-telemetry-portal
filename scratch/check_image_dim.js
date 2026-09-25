const fs = require('fs');

function getJpegDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;
    const marker = buffer[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    const len = buffer.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

const files = [
  'public/images/drivers/driver_leclerc.jpg',
  'public/images/drivers/portraits/charles-leclerc.jpg',
  'public/images/teams/team_ferrari_f2004.jpg',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    console.log(f, getJpegDimensions(f));
  } else {
    console.log(f, 'not found');
  }
});
