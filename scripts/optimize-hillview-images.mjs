import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects', 'hillview-physiotherapy');
const OUTPUT_DIR = INPUT_DIR;

async function optimizeImages() {
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputName);
    
    console.log(`Optimizing ${file}...`);
    
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    // For full-page screenshots that are very tall, we'll resize to a reasonable width
    // while maintaining aspect ratio, and convert to WebP with quality 80
    let pipeline = sharp(inputPath);
    
    // If image is very wide (desktop full page), cap width at 1920
    if (metadata.width && metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
    }
    
    // For mobile, cap width at 750
    if (file.includes('mobile') && metadata.width && metadata.width > 750) {
      pipeline = pipeline.resize(750, null, { withoutEnlargement: true });
    }
    
    await pipeline
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
    
    const outputSize = fs.statSync(outputPath).size;
    console.log(`  Optimized: ${outputName}, ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Delete original PNG
    fs.unlinkSync(inputPath);
    console.log(`  Removed original PNG`);
  }
  
  console.log('All images optimized!');
}

optimizeImages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});