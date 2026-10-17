const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const clientDir = path.resolve(__dirname, '..');
const faviconSvgPath = path.join(clientDir, 'public/quizzy-favicon.svg');
const wordmarkSvgPath = path.join(clientDir, 'public/quizzy-wordmark.svg');

async function updateBrand() {
  console.log('🔄 Updating Quizzy brand assets from SVG sources...');

  const faviconSvgBuf = fs.readFileSync(faviconSvgPath);
  const wordmarkSvgBuf = fs.readFileSync(wordmarkSvgPath);

  // 1. Copy SVG favicon directly to app/icon.svg and public/favicon.svg
  fs.writeFileSync(path.join(clientDir, 'app/icon.svg'), faviconSvgBuf);
  fs.writeFileSync(path.join(clientDir, 'public/favicon.svg'), faviconSvgBuf);
  console.log('✅ icon.svg copied to app/ and public/');

  // 2. Generate multi-size ICO (16, 32, 48) from quizzy-favicon.svg
  const icoSizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    icoSizes.map((s) =>
      sharp(faviconSvgBuf, { density: 300 })
        .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  const count = icoSizes.length;
  const headerSize = 6 + 16 * count;
  let totalDataSize = 0;
  for (const b of pngBuffers) totalDataSize += b.length;

  const icoBuf = Buffer.alloc(headerSize + totalDataSize);
  icoBuf.writeUInt16LE(0, 0); // reserved
  icoBuf.writeUInt16LE(1, 2); // type 1 = ICO
  icoBuf.writeUInt16LE(count, 4); // count

  let offset = headerSize;
  for (let i = 0; i < count; i++) {
    const s = icoSizes[i];
    const b = pngBuffers[i];
    const entryOffset = 6 + i * 16;
    icoBuf.writeUInt8(s === 256 ? 0 : s, entryOffset); // width
    icoBuf.writeUInt8(s === 256 ? 0 : s, entryOffset + 1); // height
    icoBuf.writeUInt8(0, entryOffset + 2); // color count
    icoBuf.writeUInt8(0, entryOffset + 3); // reserved
    icoBuf.writeUInt16LE(1, entryOffset + 4); // planes
    icoBuf.writeUInt16LE(32, entryOffset + 6); // bpp
    icoBuf.writeUInt32LE(b.length, entryOffset + 8); // size
    icoBuf.writeUInt32LE(offset, entryOffset + 12); // offset

    b.copy(icoBuf, offset);
    offset += b.length;
  }

  fs.writeFileSync(path.join(clientDir, 'public/favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(clientDir, 'app/favicon.ico'), icoBuf);
  console.log('✅ favicon.ico updated in public/ and app/');

  // 3. Generate icon.png (192x192) and apple-icon.png (180x180)
  const icon192 = await sharp(faviconSvgBuf, { density: 300 })
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/icon.png'), icon192);
  fs.writeFileSync(path.join(clientDir, 'app/icon.png'), icon192);

  const appleIcon = await sharp(faviconSvgBuf, { density: 300 })
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/apple-icon.png'), appleIcon);
  fs.writeFileSync(path.join(clientDir, 'app/apple-icon.png'), appleIcon);
  console.log('✅ icon.png and apple-icon.png updated in public/ and app/');

  // 4. Update quizzy-logo.png and quizzy-hero-logo.jpg in public/images
  // Render wordmark to high-res PNG for fallbacks
  const wordmarkPng = await sharp(wordmarkSvgBuf, { density: 300 })
    .resize(480, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/quizzy-logo.png'), wordmarkPng);
  fs.writeFileSync(path.join(clientDir, 'public/logo.png'), wordmarkPng);
  console.log('✅ quizzy-logo.png updated with new wordmark');

  console.log('🎉 Brand asset synchronization complete!');
}

updateBrand().catch((err) => {
  console.error('Error updating brand:', err);
  process.exit(1);
});
