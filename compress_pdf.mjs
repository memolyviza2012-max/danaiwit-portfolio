import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

(async () => {
    const existingPdfBytes = fs.readFileSync('C:/Users/WiT.Danaiwit/Downloads/TIAIF/Certificate_The Stroke Of Night.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    fs.writeFileSync('public/Certificate_Compressed.pdf', pdfBytes);
})();
