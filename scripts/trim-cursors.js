import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const cursorsDir = path.join(rootDir, 'public', 'cursors');

async function processCursor(inputPath, outputPath) {
  try {
    const inputMetadata = await sharp(inputPath).metadata();
    console.log(`Processing: ${path.basename(inputPath)} (${inputMetadata.width}x${inputMetadata.height})`);

    // First trim the transparent whitespace
    const trimmedBuffer = await sharp(inputPath)
      .trim() // Automatically crops away all surrounding transparent padding
      .toBuffer({ resolveWithObject: true });

    console.log(`  -> Trimmed to ${trimmedBuffer.info.width}x${trimmedBuffer.info.height}`);

    // Now resize down to standard 32x32 browser-safe cursor dimensions
    await sharp(trimmedBuffer.data)
      .resize(32, 32, { fit: 'inside' })
      .toFile(outputPath);

    const outMetadata = await sharp(outputPath).metadata();
    console.log(`  -> Saved ${path.basename(outputPath)} (${outMetadata.width}x${outMetadata.height})\n`);
  } catch (err) {
    console.error(`Error processing ${inputPath}:`, err);
  }
}

async function run() {
  if (!fs.existsSync(cursorsDir)) {
    fs.mkdirSync(cursorsDir, { recursive: true });
  }

  // Backup or source files
  const sources = [
    {
      input: path.join(cursorsDir, 'cursor_screwdriver.png.png'),
      fallbackInput: path.join(cursorsDir, 'cursor_screwdriver.png'),
      output: path.join(cursorsDir, 'cursor_screwdriver.png'),
    },
    {
      input: path.join(cursorsDir, 'cursor_tape.png.png'),
      fallbackInput: path.join(cursorsDir, 'cursor_tape.png'),
      output: path.join(cursorsDir, 'cursor_tape.png'),
    },
    {
      input: path.join(cursorsDir, 'cursor_comb.png.png'),
      fallbackInput: path.join(cursorsDir, 'cursor_comb.png'),
      output: path.join(cursorsDir, 'cursor_comb.png'),
    },
  ];

  for (const item of sources) {
    let inputPath = item.input;
    if (!fs.existsSync(inputPath)) {
      inputPath = item.fallbackInput;
    }
    const tempOutput = item.output + '.tmp.png';
    await processCursor(inputPath, tempOutput);
    if (fs.existsSync(tempOutput)) {
      fs.copyFileSync(tempOutput, item.output);
      fs.unlinkSync(tempOutput);
    }
  }

  console.log('All cursors trimmed and resized successfully!');
}

run();
