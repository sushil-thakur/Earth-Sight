const express = require('express');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs').promises;
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate PDF report
router.post('/report', authenticateToken, async (req, res) => {
  try {
    const { predictionData, userInput } = req.body;

    if (!predictionData || !userInput) {
      return res.status(400).json({ 
        error: 'Prediction data and user input are required' 
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePDFReport(predictionData, userInput, req.user);

    // Check if client wants blob response or file download
    const wantsBlobResponse = req.headers.accept && req.headers.accept.includes('application/pdf');
    
    if (wantsBlobResponse || req.query.format === 'blob') {
      // Return PDF as blob for direct download
      const filename = `earthslight-report-${Date.now()}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      
      return res.send(pdfBuffer);
    } else {
      // Traditional file-based approach
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads');
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }

      // Save PDF to file
      const filename = `report_${Date.now()}_${req.user._id}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, pdfBuffer);

      // Return download link
      const downloadUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

      res.json({
        success: true,
        message: 'PDF report generated successfully',
        downloadUrl: downloadUrl,
        filename: filename,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

// Generate PDF report using Puppeteer
async function generatePDFReport(predictionData, userInput, user) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Generate HTML content
    const htmlContent = generateHTMLReport(predictionData, userInput, user);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

// Generate HTML report using Handlebars
function generateHTMLReport(predictionData, userInput, user) {
  const template = 
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>EarthSlight - Real Estate Prediction Report</title>' +
        '<style>' +
            'body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }' +
            '.container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }' +
            '.header { text-align: center; border-bottom: 3px solid #28a745; padding-bottom: 20px; margin-bottom: 30px; }' +
            '.logo { font-size: 2.5em; color: #28a745; margin-bottom: 10px; }' +
            '.title { font-size: 1.8em; color: #333; margin-bottom: 10px; }' +
            '.subtitle { color: #666; font-size: 1.1em; }' +
            '.section { margin-bottom: 30px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; background-color: #f8f9fa; }' +
            '.section-title { font-size: 1.4em; color: #28a745; margin-bottom: 15px; border-bottom: 2px solid #28a745; padding-bottom: 5px; }' +
            '.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }' +
            '.info-item { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; }' +
            '.info-label { font-weight: bold; color: #555; margin-bottom: 5px; }' +
            '.info-value { font-size: 1.1em; color: #333; }' +
            '.prediction-highlight { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }' +
            '.prediction-price { font-size: 2.5em; font-weight: bold; margin-bottom: 10px; }' +
            '.confidence { font-size: 1.1em; opacity: 0.9; }' +
            '.forecast-table { width: 100%; border-collapse: collapse; margin-top: 15px; }' +
            '.forecast-table th, .forecast-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }' +
            '.forecast-table th { background-color: #28a745; color: white; }' +
            '.forecast-table tr:nth-child(even) { background-color: #f2f2f2; }' +
            '.footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; }' +
            '.timestamp { font-size: 0.9em; color: #888; margin-top: 10px; }' +
        '</style>' +
    '</head>' +
    '<body>' +
        '<div class="container">' +
            '<div class="header">' +
                '<div class="logo">🌍 EarthSlight</div>' +
                '<div class="title">Real Estate Prediction Report</div>' +
                '<div class="subtitle">AI-Powered Property Valuation & Market Analysis</div>' +
            '</div>' +

            '<div class="section">' +
                '<div class="section-title">📋 Report Information</div>' +
                '<div class="grid">' +
                    '<div class="info-item">' +
                        '' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Report Date:</div>' +
                        '<div class="info-value">{{reportDate}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                         '<div class="info-label">User Email:</div>' +
                         '<div class="info-value">{{user.email}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="section">' +
                '<div class="section-title">🏠 Property Details</div>' +
                '<div class="grid">' +
                    '<div class="info-item">' +
                        '<div class="info-label">Location:</div>' +
                        '<div class="info-value">{{userInput.location}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Area (sq ft):</div>' +
                        '<div class="info-value">{{userInput.area}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Bedrooms:</div>' +
                        '<div class="info-value">{{userInput.bedrooms}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Bathrooms:</div>' +
                        '<div class="info-value">{{userInput.bathrooms}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Floors:</div>' +
                        '<div class="info-value">{{userInput.floors}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Age (years):</div>' +
                        '<div class="info-value">{{userInput.age}}</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="prediction-highlight">' +
                '<div class="prediction-price">${{formatNumber predictionData.prediction.currentPrice}}</div>' +
                '<div class="confidence">Predicted Price with {{predictionData.prediction.confidence}}% Confidence</div>' +
            '</div>' +

            '<div class="section">' +
                '<div class="section-title">📊 Market Analysis</div>' +
                '<div class="grid">' +
                    '<div class="info-item">' +
                        '<div class="info-label">Market Trend:</div>' +
                        '<div class="info-value">{{predictionData.summary.marketTrend}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Location Score:</div>' +
                        '<div class="info-value">{{predictionData.summary.locationScore}}/100</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Total Properties Analyzed:</div>' +
                        '<div class="info-value">{{predictionData.summary.totalProperties}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Average Market Price:</div>' +
                        '<div class="info-value">${{formatNumber predictionData.summary.averagePrice}}</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="section">' +
                '<div class="section-title">📈 10-Year Price Forecast</div>' +
                '<table class="forecast-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Year</th>' +
                            '<th>Predicted Price</th>' +
                            '<th>Growth Rate</th>' +
                            '<th>Confidence</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '{{#each predictionData.forecast}}' +
                        '<tr>' +
                            '<td>{{this.year}}</td>' +
                            '<td>${{formatNumber this.price}}</td>' +
                            '<td>{{this.growth}}%</td>' +
                            '<td>{{this.confidence}}%</td>' +
                        '</tr>' +
                        '{{/each}}' +
                    '</tbody>' +
                '</table>' +
            '</div>' +

            '<div class="section">' +
                '<div class="section-title">🔍 Key Factors</div>' +
                '<div class="grid">' +
                    '{{#each predictionData.prediction.factors}}' +
                    '<div class="info-item">' +
                        '<div class="info-label">{{this.name}}:</div>' +
                        '<div class="info-value">{{this.impact}}x ({{this.description}})</div>' +
                    '</div>' +
                    '{{/each}}' +
                '</div>' +
            '</div>' +

            '<div class="footer">' +
                '<p><strong>EarthSlight</strong> - Environmental Risk Monitoring & Real Estate Prediction Platform</p>' +
                '<p>This report was generated using advanced AI algorithms and market analysis.</p>' +
                '<div class="timestamp">Generated on {{reportDate}} at {{reportTime}}</div>' +
            '</div>' +
        '</div>' +
    '</body>' +
    '</html>';

  // Register Handlebars helpers
  handlebars.registerHelper('formatNumber', function(number) {
    return new Intl.NumberFormat('en-US').format(number);
  });

  // Compile template
  const compiledTemplate = handlebars.compile(template);

  // Prepare data
  const now = new Date();
  const reportDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportTime = now.toLocaleTimeString('en-US');

  // Generate HTML
  const html = compiledTemplate({
    user: user,
    userInput: userInput,
    predictionData: predictionData,
    reportDate: reportDate,
    reportTime: reportTime
  });

  return html;
}

// Download PDF file
router.get('/download/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    try {
      await fs.access(filepath);
    } catch {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = require('fs').createReadStream(filepath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

module.exports = router; 