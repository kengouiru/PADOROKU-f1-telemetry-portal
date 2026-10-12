const http = require('http');

http.get('http://localhost:3000/_next/static/css/app/layout.css?v=1791380508744', (res) => {
  let css = '';
  res.on('data', chunk => css += chunk);
  res.on('end', () => {
    console.log('CSS length:', css.length);
    console.log('Contains .absolute:', css.includes('.absolute'));
    console.log('Contains .relative:', css.includes('.relative'));
    console.log('Contains .inset-0:', css.includes('.inset-0'));
    console.log('Sample CSS:', css.slice(0, 300));
  });
});
