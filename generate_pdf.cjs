const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const htmlPath = path.resolve(__dirname, 'public', 'portfolio.html');
  const fileUrl = 'file://' + htmlPath;
  console.log('Loading page:', fileUrl);
  
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  console.log('Generating PDF...');
  await page.pdf({
    path: path.resolve(__dirname, 'public', 'Danaiwit_Portfolio.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  console.log('PDF generated at public/Danaiwit_Portfolio.pdf');
  await browser.close();
})();
