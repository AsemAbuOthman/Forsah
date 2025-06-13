// pdfGenerator.js
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const generatePDF = async (data) => {
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([600, 400]);
const { height } = page.getSize();
const fontSize = 12;

const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

// Add title
page.drawText('Payment Receipt', {
    x: 50,
    y: height - 50,
    size: 20,
    font,
    color: rgb(0, 0, 0),
});

// Add payment details
let y = height - 100;
page.drawText(`Payment ID: ${data.transactionId}`, { x: 50, y, size: fontSize, font });
y -= 20;
page.drawText(`Date: ${new Date(data.paymentDate).toLocaleString()}`, { x: 50, y, size: fontSize, font });
y -= 20;
page.drawText(`Payment Method: ${data.method}`, { x: 50, y, size: fontSize, font });

if (data.method === 'credit-card') {
    y -= 20;
    page.drawText(`Card ending in: ${data.cardLast4}`, { x: 50, y, size: fontSize, font });
}

// Add order summary
y -= 40;
page.drawText('Order Summary:', { x: 50, y, size: 16, font });
y -= 20;

data.items.forEach(item => {
    page.drawText(`${item.name}: $${item.price.toFixed(2)}`, { x: 50, y, size: fontSize, font });
    y -= 20;
});

y -= 20;
page.drawText(`Subtotal: $${data.subtotal.toFixed(2)}`, { x: 50, y, size: fontSize, font });
y -= 20;
page.drawText(`Tax: $${(data.subtotal * data.tax).toFixed(2)}`, { x: 50, y, size: fontSize, font });
y -= 20;
page.drawText(`Total: $${data.total.toFixed(2)}`, { x: 50, y, size: fontSize, font, color: rgb(0, 0.5, 0) });

const pdfBytes = await pdfDoc.save();
return new Blob([pdfBytes], { type: 'application/pdf' });
};