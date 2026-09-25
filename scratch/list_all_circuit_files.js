const fs = require('fs');
const files = fs.readdirSync('./public/images/circuits');
console.log(files.sort().join('\n'));
