import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects', 'hillview-physiotherapy');

async function captureScreenshots() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  
  try {
    // Capture redesigned website from new URL
    console.log('Capturing redesigned website: https://hillview-sigma.vercel.app/');
    const redesignedPage = await browser.newPage();
    await redesignedPage.setViewportSize({ width: 1920, height: 1080 });
    await redesignedPage.goto('https://hillview-sigma.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await redesignedPage.waitForTimeout(3000);
    await redesignedPage.screenshot({ 
      path: path.join(OUTPUT_DIR, 'after-desktop.png'),
      fullPage: true 
    });
    console.log('✓ Captured after-desktop.png');
    
    // Mobile view of redesigned
    await redesignedPage.setViewportSize({ width: 375, height: 812 });
    await redesignedPage.waitForTimeout(1000);
    await redesignedPage.screenshot({ 
      path: path.join(OUTPUT_DIR, 'after-mobile.png'),
      fullPage: true 
    });
    console.log('✓ Captured after-mobile.png');
    await redesignedPage.close();

  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots()
  .then(() => console.log('All screenshots captured successfully!'))
  .catch((err) => {
    console.error('Failed to capture screenshots:', err);
    process.exit(1);
  });