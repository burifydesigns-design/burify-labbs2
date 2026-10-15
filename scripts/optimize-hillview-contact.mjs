import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects', 'hillview-physiotherapy');
const OUTPUT_DIR = INPUT_DIR;

async function optimizeContactImages() {
  const files = ['after-contact-desktop.png', 'after-contact-mobile.png'];
  
  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} - not found`);
      continue;
    }
    
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    console.log(`Optimizing ${file}...`);
    
    const metadata = await sharp(inputPath).metadata();
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    let pipeline = sharp(inputPath);
    
    if (file.includes('desktop') && metadata.width && metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
    }
    
    if (file.includes('mobile') && metadata.width && metadata.width > 750) {
      pipeline = pipeline.resize(750, null, { withoutEnlargement: true });
    }
    
    await pipeline
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
    
    const outputSize = fs.statSync(outputPath).size;
    console.log(`  Optimized: ${outputName}, ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    
    fs.unlinkSync(inputPath);
    console.log(`  Removed original PNG`);
  }
  
  console.log('Contact section images optimized!');
}

optimizeContactImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});