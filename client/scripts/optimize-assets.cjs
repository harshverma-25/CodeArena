const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const clientDir = path.resolve(__dirname, '..');

async function runOptimization() {
  console.log('Starting asset optimization with sharp...');

  const masterIconPath = path.join(clientDir, 'public/icon.png');
  const masterHeroLogoPath = path.join(clientDir, 'public/images/quizzy-hero-logo.jpg');
  const masterLogoPath = path.join(clientDir, 'public/images/quizzy-logo.png');
  const gamerBoyPath = path.join(clientDir, 'public/images/gamer-boy.jpg');
  const gamerGirlPath = path.join(clientDir, 'public/images/gamer-girl.jpg');

  // Backup copies first in memory
  const masterIconBuf = fs.readFileSync(masterIconPath);
  const masterHeroBuf = fs.readFileSync(masterHeroLogoPath);
  const masterLogoBuf = fs.readFileSync(masterLogoPath);
  const gamerBoyBuf = fs.readFileSync(gamerBoyPath);
  const gamerGirlBuf = fs.readFileSync(gamerGirlPath);

  // 1. Generate multi-resolution ICO (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    icoSizes.map((s) =>
      sharp(masterIconBuf)
        .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
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
  console.log('✓ favicon.ico written to public and app (size:', icoBuf.length, 'bytes)');

  // 2. Generate standard icon.png (48x48)
  const icon48Buf = await sharp(masterIconBuf)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(clientDir, 'public/icon.png'), icon48Buf);
  fs.writeFileSync(path.join(clientDir, 'app/icon.png'), icon48Buf);
  console.log('✓ icon.png written to public and app (size:', icon48Buf.length, 'bytes)');

  // 3. Generate apple-icon.png (180x180)
  const apple180Buf = await sharp(masterIconBuf)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(clientDir, 'app/apple-icon.png'), apple180Buf);
  fs.writeFileSync(path.join(clientDir, 'public/apple-icon.png'), apple180Buf);
  console.log('✓ apple-icon.png written to app and public (size:', apple180Buf.length, 'bytes)');

  // 4. Optimize quizzy-hero-logo.jpg (600px width with mozjpeg q85 and webp equivalent)
  // Display size is 44px height x ~79px width, so 600px width is ~7.5x retina resolution!
  const heroJpgBuf = await sharp(masterHeroBuf)
    .resize(600)
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/quizzy-hero-logo.jpg'), heroJpgBuf);

  const heroWebpBuf = await sharp(masterHeroBuf)
    .resize(600)
    .webp({ quality: 85 })
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/quizzy-hero-logo.webp'), heroWebpBuf);
  console.log('✓ quizzy-hero-logo.jpg written (size:', heroJpgBuf.length, 'bytes), webp (size:', heroWebpBuf.length, 'bytes)');

  // 5. Optimize quizzy-logo.png (500px width with palette quantization, preserving transparency)
  // Display size is 40px height x 108px width, so 500px width is ~4.6x retina resolution!
  const logoPngBuf = await sharp(masterLogoBuf)
    .resize(500)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/quizzy-logo.png'), logoPngBuf);
  fs.writeFileSync(path.join(clientDir, 'public/logo.png'), logoPngBuf);

  const logoWebpBuf = await sharp(masterLogoBuf)
    .resize(500)
    .webp({ quality: 90 })
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/quizzy-logo.webp'), logoWebpBuf);
  console.log('✓ quizzy-logo.png written (size:', logoPngBuf.length, 'bytes), webp (size:', logoWebpBuf.length, 'bytes)');

  // 6. Compress oversized gamer-boy and gamer-girl (512x512 mozjpeg q80)
  const gamerBoyOpt = await sharp(gamerBoyBuf)
    .resize(512, 512)
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/gamer-boy.jpg'), gamerBoyOpt);

  const gamerGirlOpt = await sharp(gamerGirlBuf)
    .resize(512, 512)
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(path.join(clientDir, 'public/images/gamer-girl.jpg'), gamerGirlOpt);
  console.log('✓ gamer-boy.jpg (size:', gamerBoyOpt.length, 'bytes), gamer-girl.jpg (size:', gamerGirlOpt.length, 'bytes)');

  console.log('Optimization complete!');
}

runOptimization().catch((err) => {
  console.error('Optimization error:', err);
  process.exit(1);
});
