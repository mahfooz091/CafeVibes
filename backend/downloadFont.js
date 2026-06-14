import fs from 'fs';
import path from 'path';
import https from 'https';

const fontDir = path.resolve('assets/fonts');
if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
}

const fontPath = path.join(fontDir, 'Roboto-Regular.ttf');
const url = 'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf';

console.log(`Downloading font from ${url}...`);
const file = fs.createWriteStream(fontPath);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log(`Font downloaded successfully to ${fontPath}`);
    process.exit(0);
  });
}).on('error', (err) => {
  fs.unlink(fontPath, () => {});
  console.error(`Error downloading font: ${err.message}`);
  process.exit(1);
});
