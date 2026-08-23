import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: false 
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('file:///C:/Users/WiT.Danaiwit/Downloads/TIAIF/Certificate_The%20Stroke%20Of%20Night.pdf');
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'public/portfolio_pdf_assets/certificate.jpg', type: 'jpeg', quality: 50 }); // Lower quality to save space
    await browser.close();
})();
