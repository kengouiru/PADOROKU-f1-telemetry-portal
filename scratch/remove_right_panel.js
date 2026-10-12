const fs = require('fs');
let text = fs.readFileSync('app/page.tsx', 'utf8');

const regex = /\{\/\* Right Panel: AI & Notebook \(Desktop only\) \*\/\}\s*<aside[\s\S]*?<\/aside>/;
if (regex.test(text)) {
    text = text.replace(regex, '');
    fs.writeFileSync('app/page.tsx', text, 'utf8');
    console.log('Removed Right Panel');
} else {
    console.log('Right Panel not found');
}
