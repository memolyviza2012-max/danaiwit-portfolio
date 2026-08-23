import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

(async () => {
    const jpgImageBytes = fs.readFileSync('public/portfolio_pdf_assets/certificate.jpg');
    const pdfDoc = await PDFDocument.create();
    const jpgImage = await pdfDoc.embedJpg(jpgImageBytes);
    
    // The screenshot was 1920x1080, we can use these dimensions or the image's exact dimensions
    const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
    
    page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: jpgImage.width,
        height: jpgImage.height,
    });
    
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('public/Certificate_Compressed.pdf', pdfBytes);
})();
