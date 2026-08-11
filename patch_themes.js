import fs from 'fs';
let code = fs.readFileSync('src/utils/storage.ts', 'utf-8');

code = code.replace(
  "description: 'Atmosfera marina blu cobalto rilassante.',",
  "description: 'Atmosfera marina blu cobalto rilassante.',\n    weather: 'rain',"
);

code = code.replace(
  "description: 'Luci al neon viola synthwave futuristiche.',",
  "description: 'Luci al neon viola synthwave futuristiche.',\n    weather: 'rain',"
);

code = code.replace(
  "description: 'Caldi toni arancio e rosso fuoco del crepuscolo.',",
  "description: 'Caldi toni arancio e rosso fuoco del crepuscolo.',\n    weather: 'none',"
);

code = code.replace(
  "description: 'Toni verdi naturali da giungla lussureggiante.',",
  "description: 'Toni verdi naturali da giungla lussureggiante.',\n    weather: 'none',"
);

code = code.replace(
  "description: 'Freddo paesaggio notturno glaciale.',",
  "description: 'Freddo paesaggio notturno glaciale.',\n    weather: 'snow',"
);

fs.writeFileSync('src/utils/storage.ts', code);
console.log('patched themes');
