import { convert } from 'pdf-img-convert';
import fs from 'fs';

(async () => {
    console.log('Starting conversion...');
    const outputImages = await convert('C:/Users/WiT.Danaiwit/Downloads/TIAIF/Certificate_The Stroke Of Night.pdf', {
        width: 1200,
        page_numbers: [1]
    });
    
    fs.writeFileSync('public/portfolio_pdf_assets/certificate_temp.png', outputImages[0]);
    console.log('Conversion successful!');
})();
