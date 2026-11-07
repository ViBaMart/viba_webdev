const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processLogo() {
  const srcPath = 'C:/Users/vk311/.gemini/antigravity/brain/84d54a3f-f70d-4df3-b2a1-7a2d0abbfeaa/.user_uploaded/media_1793995640963_875f3f04.jpg';
  
  // 1. Save full original image with background as-is
  await sharp(srcPath).png().toFile('public/vb-monogram-full.png');
  fs.copyFileSync(srcPath, 'public/vb-monogram-full.jpg');
  fs.copyFileSync(srcPath, 'public/vb-monogram.jpg');
  fs.copyFileSync(srcPath, 'public/vb-monogram-concept.jpg');
  console.log('Original image saved to public/');

  // 2. Generate high quality transparent version
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  
  const Y_TOP = 269;
  const Y_BOTTOM = 707;
  
  // Create mask buffer
  const mask = new Float32Array(w * h);
  
  for (let y = Y_TOP; y <= Y_BOTTOM; y++) {
    for (let x = 160; x <= 860; x++) {
      const idx = (y * w + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      
      const isWhite = (r > 190 && g > 190 && b > 190);
      const isCyan = (b > 150 && g > 65 && (b - r > 40));
      
      if (isWhite || isCyan) {
        mask[y * w + x] = 1.0;
      }
    }
    
    // Fill the 3D bevel between thin white bar and cyan V
    let w2_end = -1;
    for (let x = 600; x >= 350; x--) {
      if (mask[y * w + x] === 1.0 && data[(y*w+x)*3] > 190) {
        w2_end = x;
        break;
      }
    }
    let cyan_start = -1;
    if (w2_end > 0) {
      for (let x = w2_end + 1; x < w2_end + 80; x++) {
        if (mask[y * w + x] === 1.0 && data[(y*w+x)*3 + 2] > 150) {
          cyan_start = x;
          break;
        }
      }
    }
    if (w2_end > 0 && cyan_start > w2_end && (cyan_start - w2_end) < 60) {
      for (let x = w2_end + 1; x < cyan_start; x++) {
        mask[y * w + x] = 1.0;
      }
    }
  }

  // Smooth edges of the mask using 3x3 anti-aliasing
  const smoothMask = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          sum += mask[(y + dy) * w + (x + dx)];
        }
      }
      smoothMask[y * w + x] = sum / 9.0;
    }
  }

  // Build RGBA buffer with smoothed alpha
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * w + x) * 3;
      const dstIdx = (y * w + x) * 4;
      rgba[dstIdx] = data[srcIdx];
      rgba[dstIdx + 1] = data[srcIdx + 1];
      rgba[dstIdx + 2] = data[srcIdx + 2];
      
      const a = smoothMask[y * w + x];
      let alphaVal = 0;
      if (a >= 0.8) alphaVal = 255;
      else if (a <= 0.1) alphaVal = 0;
      else alphaVal = Math.round(((a - 0.1) / 0.7) * 255);
      
      rgba[dstIdx + 3] = alphaVal;
    }
  }

  // Crop the logo bounds: [176, 269] to [846, 708] (width 670, height 439)
  const cropX = 176, cropY = 269, cropW = 670, cropH = 439;
  const croppedPng = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toBuffer();

  // Composite onto a centered 1024x1024 Ultra-HD square canvas
  // Maximizing scale (980px width) so the monogram fills the icon area without excessive padding
  const targetW = 980;
  const targetH = Math.round(targetW * (cropH / cropW));
  const resizedPng = await sharp(croppedPng)
    .resize(targetW, targetH, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const offsetX = Math.round((1024 - targetW) / 2);
  const offsetY = Math.round((1024 - targetH) / 2);

  const centeredLogo = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{ input: resizedPng, left: offsetX, top: offsetY }])
  .png({ compressionLevel: 9 })
  .toBuffer();

  // Save master transparent files (Ultra-HD 1024x1024)
  fs.writeFileSync('public/vb-monogram-transparent.png', centeredLogo);
  fs.writeFileSync('public/vb-monogram.png', centeredLogo);
  console.log('Saved public/vb-monogram-transparent.png and public/vb-monogram.png');

  // Generate crisp Ultra-HD favicon resolutions using Lanczos3 + subtle sharpening for maximum clarity
  const generateCrispPng = async (dim) => {
    return await sharp(centeredLogo)
      .resize(dim, dim, { kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: dim <= 32 ? 0.8 : 0.5, m1: 0.5, m2: 1.5 })
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  const p16 = await generateCrispPng(16);
  const p32 = await generateCrispPng(32);
  const p48 = await generateCrispPng(48);
  const p64 = await generateCrispPng(64);
  const p96 = await generateCrispPng(96);
  const p128 = await generateCrispPng(128);
  const p180 = await generateCrispPng(180);
  const p192 = await generateCrispPng(192);
  const p256 = await generateCrispPng(256);
  const p512 = await generateCrispPng(512);

  fs.writeFileSync('public/favicon-16x16.png', p16);
  fs.writeFileSync('public/favicon-32x32.png', p32);
  fs.writeFileSync('public/favicon-48x48.png', p48);
  fs.writeFileSync('public/favicon-96x96.png', p96);
  fs.writeFileSync('public/apple-touch-icon.png', p180);
  fs.writeFileSync('public/android-chrome-192x192.png', p192);
  fs.writeFileSync('public/icon-192x192.png', p192);
  fs.writeFileSync('public/android-chrome-512x512.png', p512);
  fs.writeFileSync('public/icon-512x512.png', p512);

  // Build multi-size Ultra-HD Windows ICO (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
  function createIco(pngBuffers, dims) {
    const numImages = pngBuffers.length;
    const headerSize = 6;
    const dirEntrySize = 16;
    let offset = headerSize + dirEntrySize * numImages;

    const header = Buffer.alloc(headerSize);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type 1 = ICO
    header.writeUInt16LE(numImages, 4);

    const dirEntries = [];
    pngBuffers.forEach((buf, idx) => {
      const entry = Buffer.alloc(dirEntrySize);
      const dim = dims[idx];

      entry.writeUInt8(dim === 256 ? 0 : dim, 0); // width (0 = 256)
      entry.writeUInt8(dim === 256 ? 0 : dim, 1); // height (0 = 256)
      entry.writeUInt8(0, 2); // color palette
      entry.writeUInt8(0, 3); // reserved
      entry.writeUInt16LE(1, 4); // color planes
      entry.writeUInt16LE(32, 6); // bits per pixel
      entry.writeUInt32LE(buf.length, 8); // image size
      entry.writeUInt32LE(offset, 12); // image offset

      dirEntries.push(entry);
      offset += buf.length;
    });

    return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
  }

  const icoDims = [16, 32, 48, 64, 128, 256];
  const icoBuffers = [p16, p32, p48, p64, p128, p256];
  const icoBuf = createIco(icoBuffers, icoDims);
  fs.writeFileSync('public/favicon.ico', icoBuf);
  fs.writeFileSync('src/app/favicon.ico', icoBuf);
  console.log('Saved public/favicon.ico and src/app/favicon.ico with Ultra-HD resolutions (16 to 256px)!');

  // Generate SVG wrappers for vector endpoints
  const pngBase64 = centeredLogo.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <image href="data:image/png;base64,${pngBase64}" width="1024" height="1024" />
</svg>
`;
  fs.writeFileSync('public/icon.svg', svg);
  fs.writeFileSync('public/vb-monogram.svg', svg);
  console.log('Saved public/icon.svg and public/vb-monogram.svg successfully!');
}

processLogo().catch(err => {
  console.error(err);
  process.exit(1);
});
