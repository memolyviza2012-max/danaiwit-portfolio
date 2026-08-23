import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
    if (!fs.existsSync('public/exam_prep')) {
        fs.mkdirSync('public/exam_prep');
    }
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://exam-prep-cmu.vercel.app/', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'public/exam_prep/screenshot.jpg', type: 'jpeg', quality: 80 });
    await browser.close();
})();
