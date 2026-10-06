const fs = require('fs'); 
let c = fs.readFileSync('src/components/shared/NavbarClient.tsx', 'utf8'); 
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('text-amber-500 drop-shadow-sm text-lg leading-none')) {
    lines[i] = '                    <span className="text-amber-500 drop-shadow-sm text-lg leading-none">★</span>';
  }
}
fs.writeFileSync('src/components/shared/NavbarClient.tsx', lines.join('\n'));
