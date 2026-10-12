const http = require('http');

http.get('http://localhost:3000', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const links = html.match(/<link[^>]+>/g) || [];
    console.log('Links in HTML:');
    links.forEach(l => console.log(l));
  });
});
