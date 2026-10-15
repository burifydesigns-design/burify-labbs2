import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'projects', 'hillview-physiotherapy');

async function captureContactSection() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  
  try {
    console.log('Capturing contact section from redesigned website...');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('https://hillview-sigma.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Scroll to contact section - try to find it
    const contactSection = await page.locator('section').filter({ hasText: /contact/i }).first();
    if (await contactSection.count() > 0) {
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Take screenshot of just the contact section
      await contactSection.screenshot({ 
        path: path.join(OUTPUT_DIR, 'after-contact-desktop.png')
      });
      console.log('✓ Captured after-contact-desktop.png');
    } else {
      // Fallback: scroll to bottom and capture
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: path.join(OUTPUT_DIR, 'after-contact-desktop.png'),
        clip: { x: 0, y: 0, width: 1920, height: 1080 }
      });
      console.log('✓ Captured fallback after-contact-desktop.png');
    }

    // Mobile contact section
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('https://hillview-sigma.vercel.app/', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);
    
    const mobileContactSection = await page.locator('section').filter({ hasText: /contact/i }).first();
    if (await mobileContactSection.count() > 0) {
      await mobileContactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await mobileContactSection.screenshot({ 
        path: path.join(OUTPUT_DIR, 'after-contact-mobile.png')
      });
      console.log('✓ Captured after-contact-mobile.png');
    }

  } catch (error) {
    console.error('Error capturing contact section:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureContactSection()
  .then(() => console.log('Contact section screenshots captured!'))
  .catch((err) => {
    console.error('Failed to capture contact section:', err);
    process.exit(1);
  });