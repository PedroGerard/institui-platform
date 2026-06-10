import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface PdfOptions {
    title: string;
    content: string; // For now simplified text content, later could be huge structure
    footerText?: string;
}

export class PdfGeneratorService {
    async generate(options: PdfOptions): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Standard Header
            doc.fontSize(20).text(options.title, { align: 'center' });
            doc.moveDown();

            // Content
            doc.fontSize(12).text(options.content, {
                align: 'justify',
                paragraphGap: 10
            });

            // Footer
            if (options.footerText) {
                const bottom = doc.page.margins.bottom;
                doc.page.margins.bottom = 0;
                doc.text(options.footerText,
                    0.5 * (doc.page.width - 100),
                    doc.page.height - 50,
                    {
                        align: 'center',
                        lineBreak: false
                    }
                );
                doc.page.margins.bottom = bottom;
            }

            doc.end();
        });
    }
}
