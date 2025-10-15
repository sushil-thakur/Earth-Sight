const express = require('express');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs').promises;
const { authenticateToken } = require('../middleware/auth');

const https = require('https')
const axios = require('axios')
const router = express.Router();

// NOTE: This project uses OpenRouter as the single AI provider for assistant
// functionality. All previous Gemini/Grok fallback logic has been removed. Set
// OPENROUTER_API_KEY (or OPENROUTER_KEY) and optionally OPENROUTER_URL in .env.

// Generate PDF report - No authentication required
router.post('/report', async (req, res) => {
  try {
    const { predictionData, userInput, userInfo } = req.body;

    if (!predictionData || !userInput) {
      return res.status(400).json({ 
        error: 'Prediction data and user input are required' 
      });
    }

    // Generate PDF (user can be from auth or from request body)
    const userData = req.user || userInfo || { email: 'Guest User', name: 'Guest' };
    const pdfBuffer = await generatePDFReport(predictionData, userInput, userData);

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
      const userId = req.user?._id || 'guest';
      const filename = `report_${Date.now()}_${userId}.pdf`;
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
                        '<div class="info-label">Generated For:</div>' +
                        '<div class="info-value">{{user.name}}</div>' +
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
                        '<div class="info-label">Report Type:</div>' +
                        '<div class="info-value">Real Estate Prediction</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="section">' +
                '<div class="section-title">🏠 Property Details</div>' +
                '<div class="grid">' +
                    '<div class="info-item">' +
                        '<div class="info-label">Location:</div>' +
                        '<div class="info-value">' +
                            '{{#if userInput.location}}' +
                                '{{userInput.location}}' +
                            '{{else}}' +
                                '{{#if userInput.latitude}}' +
                                    'Coordinates: {{userInput.latitude}}, {{userInput.longitude}}' +
                                '{{else}}' +
                                    'Not specified' +
                                '{{/if}}' +
                            '{{/if}}' +
                        '</div>' +
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
                        '<div class="info-value">{{predictionData.prediction.marketTrend}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Location Score:</div>' +
                        '<div class="info-value">{{predictionData.prediction.locationScore}}/100</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Model Type:</div>' +
                        '<div class="info-value">{{predictionData.prediction.modelType}}</div>' +
                    '</div>' +
                    '<div class="info-item">' +
                        '<div class="info-label">Confidence Level:</div>' +
                        '<div class="info-value">{{predictionData.prediction.confidence}}%</div>' +
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
                '{{#if predictionData.prediction.factors}}' +
                '<div class="grid">' +
                    '{{#each predictionData.prediction.factors}}' +
                    '<div class="info-item">' +
                        '<div class="info-label">{{this.name}}:</div>' +
                        '<div class="info-value">{{this.impact}}x ({{this.description}})</div>' +
                    '</div>' +
                    '{{/each}}' +
                '</div>' +
                '{{else}}' +
                '<p style="color: #666; text-align: center; padding: 20px;">Key factors data will be displayed here based on the property analysis.</p>' +
                '{{/if}}' +
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

// Download PDF file - Public access (no authentication required)
router.get('/download/:filename', async (req, res) => {
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

// OCR / Content analyze endpoint - accepts multipart/form-data with file field 'file'
// Uses OCR provider (default: ocr.space) and OpenRouter as the AI provider. Keys and endpoints are read from env.
const multer = require('multer')
const FormData = require('form-data')

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

router.post('/analyze', authenticateToken, upload.single('file'), async (req, res) => {
  try {
  const ocrKey = process.env.OCR_API_KEY
    const ocrProvider = (process.env.OCR_PROVIDER || 'ocr.space').toLowerCase()

    if (!ocrKey) {
      return res.status(400).json({
        error: 'OCR_API_KEY must be set in server environment',
        message: 'Please configure OCR_API_KEY in your .env file to enable PDF text extraction.'
      })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach a PDF file in field `file`.' })
    }

    // Call OCR provider (currently supports ocr.space)
    let extractedText = ''
    let ocrRaw = null

    if (ocrProvider === 'ocr.space') {
      // ocr.space expects multipart/form-data with apikey and file
      const form = new FormData()
      form.append('apikey', ocrKey)
      form.append('file', req.file.buffer, { filename: req.file.originalname })
      form.append('language', 'eng')
      form.append('isOverlayRequired', 'false')

      // Try OCR.space with a longer timeout and one retry on timeout/ECONNABORTED.
      const ocrUrl = 'https://api.ocr.space/parse/image'
      let ocrResp = null
      const maxAttempts = 2
      let attempt = 0
      let lastOcrErr = null
      while (attempt < maxAttempts) {
        attempt++
        try {
          ocrResp = await axios.post(ocrUrl, form, {
            headers: form.getHeaders(),
            timeout: 120_000 // 2 minutes
          })
          break
        } catch (oErr) {
          lastOcrErr = oErr
          console.warn(`OCR.space attempt ${attempt} failed:`, oErr && oErr.code ? oErr.code : (oErr && oErr.message) || oErr)
          // on timeout/connection aborted, retry once
          if (oErr && oErr.code && (oErr.code === 'ECONNABORTED' || oErr.code === 'ETIMEDOUT')) {
            if (attempt < maxAttempts) {
              await new Promise(r => setTimeout(r, 1000 * attempt))
              continue
            }
          }
          break
        }
      }

      if (ocrResp && ocrResp.data) {
        ocrRaw = ocrResp.data
        if (ocrRaw && ocrRaw.ParsedResults && ocrRaw.ParsedResults[0]) {
          extractedText = ocrRaw.ParsedResults.map(p => p.ParsedText).join('\n')
        }
      } else {
        // OCR.space failed (likely timeout). Try a local fallback using pdf-parse for PDFs.
        console.warn('OCR.space failed or timed out. Attempting local pdf-parse fallback if PDF.')
        try {
          if (req.file && req.file.mimetype === 'application/pdf') {
            try {
              const pdfParse = require('pdf-parse')
              const data = await pdfParse(req.file.buffer)
              if (data && data.text) {
                extractedText = String(data.text).trim()
                ocrRaw = { fallback: 'pdf-parse', info: 'Used pdf-parse fallback due to OCR.space error', error: lastOcrErr && (lastOcrErr.message || String(lastOcrErr)) }
              }
            } catch (pdfErr) {
              console.warn('pdf-parse fallback not available or failed:', pdfErr && pdfErr.message)
            }
          }
        } catch (fbErr) {
          console.error('Error during OCR fallback:', fbErr)
        }
      }
    } else {
      // Provider not recognized — return helpful error
      return res.status(400).json({ error: `Unsupported OCR_PROVIDER: ${ocrProvider}` })
    }

    // If OCR returned nothing, avoid further processing and return informative response
    if (!extractedText || extractedText.trim().length === 0) {
      return res.json({ success: true, extractedText: '', ocrRaw, assistantResponse: null, message: 'No text could be extracted from the PDF.' })
    }

    // If the client explicitly requests an immediate AI summary (ai=true),
    // call configured LLM provider and return a concise assistantResponse.
    // Otherwise return the extracted text and a minimal acknowledgement so the frontend
    // can show "PDF received" and let the user start chatting.
    const aiRequested = (req.query && (req.query.ai === '1' || String(req.query.ai).toLowerCase() === 'true'))

    const ack = "Hello — PDF received and processed. You can now ask questions about this document."

    if (!aiRequested) {
      return res.json({ success: true, extractedText, ocrRaw, assistantResponse: ack })
    }

    // Prepare a concise prompt (no Do/Don't sections) — request three short sections:
    const systemPrompt = 'You are a concise AI assistant that summarizes documents.'
    const userPrompt = `Extracted PDF text:\n\n${extractedText}\n\nPlease provide: (1) a concise summary (3-4 sentences), (2) a short list of key findings, and (3) three actionable next steps for someone acting on this document. Keep answers brief and directly tied to the text.`

    // Use OpenRouter API key from environment
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY
    const openRouterUrl = process.env.OPENROUTER_URL || process.env.OPENROUTER_API_URL || 'https://api.openrouter.ai/v1/chat/completions'

    if (!openRouterKey) {
      // No OpenRouter configured — return the extracted text and a clear warning
      return res.json({
        success: true,
        extractedText,
        ocrRaw,
        assistantResponse: ack,
        warning: 'OpenRouter AI not configured. Set OPENROUTER_API_KEY or OPENROUTER_KEY in your .env file to enable AI-powered PDF analysis and Q&A features.'
      })
    }

    // Call OpenRouter (chat completions)
    try {
  // Allow client to override the model by sending `model` in the multipart form (req.body)
  // Default to the user's requested OpenRouter model unless overridden by env or client
  const modelName = (req.body && req.body.model) || process.env.OPENROUTER_MODEL || 'google/gemma-3n-e2b-it:free'
      const tryUrl = openRouterUrl
      const payload = {
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800
      }

      console.log('Calling OpenRouter (analyze):', { tryUrl, model: payload.model, promptPreview: String(userPrompt).slice(0, 200).replace(/\n/g, ' ') })

      const resp = await axios.post(tryUrl, payload, { headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json' }, timeout: 90000 })
      const oresp = resp.data

      // Extract assistant text from OpenRouter/standard chat-completions response
      let assistantText = null
      if (oresp) {
        // Standard choices[].message or choices[].text
        if (Array.isArray(oresp.choices) && oresp.choices[0]) {
          const ch = oresp.choices[0]
          // message may be a string or an object
          if (ch.message) {
            if (typeof ch.message === 'string') assistantText = ch.message
            else if (typeof ch.message.content === 'string') assistantText = ch.message.content
            else if (Array.isArray(ch.message.content) && ch.message.content[0]) {
              assistantText = (ch.message.content.map(c => (c.text || c)).join('\n'))
            }
          } else if (typeof ch.text === 'string') {
            assistantText = ch.text
          }
        }

        // Legacy output content shape
        if (!assistantText && oresp.output && Array.isArray(oresp.output) && oresp.output[0] && oresp.output[0].content) {
          assistantText = oresp.output[0].content.map(p => p.text || p).join('\n')
        }

        // Fallback: raw text fields anywhere
        if (!assistantText) {
          // Try some common fields
          if (oresp.result && typeof oresp.result === 'string') assistantText = oresp.result
          else if (oresp.text && typeof oresp.text === 'string') assistantText = oresp.text
        }
      }

      if (!assistantText) {
        console.warn('Could not extract text from OpenRouter response, using fallback')
        assistantText = 'I received your question but had trouble processing the response. Please try asking again.'
      }
  return res.json({ success: true, extractedText, ocrRaw, assistantResponse: assistantText, provider: 'openrouter', providerModel: modelName, raw: oresp })
    } catch (err) {
      const provStatus = err && err.response && err.response.status
      const provData = err && err.response && err.response.data
      console.error('OpenRouter API error during analyze:', provStatus || err.message, provData || err)

      // If provider indicates developer-instruction is not enabled for the model,
      // retry with a merged prompt (single user message containing both system and user content).
      try {
        const provText = provData ? (typeof provData === 'string' ? provData : JSON.stringify(provData)) : ''
        if (provText.includes('Developer instruction is not enabled')) {
          console.log('Retrying OpenRouter analyze call without developer instructions (merging system+user into one user message)')
          const mergedPayload = {
            model: modelName,
            messages: [ { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` } ],
            max_tokens: 800
          }
          const retryResp = await axios.post(tryUrl, mergedPayload, { headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json' }, timeout: 90000 })
          const rdata = retryResp.data
          // extract assistant text same as before
          let assistantText2 = null
          if (rdata) {
            if (Array.isArray(rdata.choices) && rdata.choices[0]) {
              const ch2 = rdata.choices[0]
              if (ch2.message) {
                if (typeof ch2.message === 'string') assistantText2 = ch2.message
                else if (typeof ch2.message.content === 'string') assistantText2 = ch2.message.content
                else if (Array.isArray(ch2.message.content)) assistantText2 = ch2.message.content.map(c => (c.text || c)).join('\n')
              } else if (typeof ch2.text === 'string') assistantText2 = ch2.text
            }
            if (!assistantText2 && rdata.output && Array.isArray(rdata.output) && rdata.output[0] && rdata.output[0].content) assistantText2 = rdata.output[0].content.map(p => p.text || p).join('\n')
            if (!assistantText2) {
              if (rdata.result && typeof rdata.result === 'string') assistantText2 = rdata.result
              else if (rdata.text && typeof rdata.text === 'string') assistantText2 = rdata.text
            }
          }
          if (!assistantText2) assistantText2 = 'I received your question but had trouble processing the response on retry. Please try again.'
          return res.json({ success: true, extractedText, ocrRaw, assistantResponse: assistantText2, provider: 'openrouter', providerModel: modelName, providerRetry: true, raw: rdata })
        }
      } catch (retryErr) {
        console.error('OpenRouter analyze retry failed:', retryErr && (retryErr.response ? retryErr.response.data : retryErr))
      }

      return res.json({
        success: true,
        extractedText,
        ocrRaw,
        assistantResponse: ack,
        warning: 'OpenRouter API call failed during analyze. Answers will not be available.',
        providerError: {
          status: provStatus || null,
          dataSnippet: provData ? (typeof provData === 'string' ? provData.slice(0, 1000) : JSON.stringify(provData).slice(0, 1000)) : null
        }
      })
    }
  } catch (err) {
    console.error('PDF analyze error:', err)
    res.status(500).json({ error: 'Failed to analyze PDF', details: String(err) })
  }
})


// Query the extracted PDF content with a user question
router.post('/analyze/query', authenticateToken, async (req, res) => {
  try {
    const { question, extractedText } = req.body
    // Diagnostic logging to help debug bad-request issues from the frontend
    console.log('PDF query called. question present:', Boolean(question), 'extractedText present:', Boolean(extractedText))
    if (extractedText && typeof extractedText === 'string') {
      console.log('extractedText length:', extractedText.length, 'snippet:', extractedText.slice(0, 200).replace(/\n/g, ' '))
    }

    if (!question) return res.status(400).json({ error: 'question is required', received: { question: question || null, extractedTextPresent: Boolean(extractedText) } })
    if (!extractedText) return res.status(400).json({ error: 'extractedText is required. Make sure you uploaded a PDF and received an acknowledgement.', received: { question, extractedText } })

    const systemPrompt = 'You are an AI assistant that answers questions about a specific PDF document. Use the provided extracted text to answer accurately and concisely.'
    const userPrompt = `Here is the extracted text:\n\n${extractedText}\n\nUser question: ${question}`

    // Use OpenRouter API key from environment
    const openRouterKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY
    const openRouterUrl = process.env.OPENROUTER_URL || process.env.OPENROUTER_API_URL || 'https://api.openrouter.ai/v1/chat/completions'

    if (!openRouterKey) {
      // Return success with warning so frontend can continue (no hard 400)
      return res.json({ success: true, assistantResponse: null, warning: 'OpenRouter AI not configured. Set OPENROUTER_API_KEY or OPENROUTER_KEY in your .env file to enable PDF question-answering features.' })
    }

    // Call OpenRouter
    // Allow client to request a specific model via JSON body.model (e.g. "google/gemma-3n-e2b-it:free")

    const modelName = (req.body && req.body.model) || process.env.OPENROUTER_MODEL || 'google/gemma-3n-e2b-it:free'
    const tryUrl = openRouterUrl
    try {
      const payload = {
        model: modelName,
        messages: [ { role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt } ],
        max_tokens: 800
      }

      console.log('Calling OpenRouter (query):', { tryUrl, model: payload.model, promptPreview: String(userPrompt).slice(0, 200).replace(/\n/g, ' ') })

      const resp = await axios.post(tryUrl, payload, { headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json' }, timeout: 90000 })
      const oresp = resp.data

      let assistantText = null
      if (oresp) {
        if (Array.isArray(oresp.choices) && oresp.choices[0]) {
          const ch = oresp.choices[0]
          if (ch.message) {
            if (typeof ch.message === 'string') assistantText = ch.message
            else if (typeof ch.message.content === 'string') assistantText = ch.message.content
            else if (Array.isArray(ch.message.content)) assistantText = ch.message.content.map(c => (c.text || c)).join('\n')
          } else if (typeof ch.text === 'string') {
            assistantText = ch.text
          }
        }

        if (!assistantText && oresp.output && Array.isArray(oresp.output) && oresp.output[0] && oresp.output[0].content) {
          assistantText = oresp.output[0].content.map(p => p.text || p).join('\n')
        }

        if (!assistantText) {
          if (oresp.result && typeof oresp.result === 'string') assistantText = oresp.result
          else if (oresp.text && typeof oresp.text === 'string') assistantText = oresp.text
        }
      }

      if (!assistantText) {
        console.warn('Could not extract text from OpenRouter response, using fallback')
        assistantText = 'I received your question but had trouble processing the response. Please try asking again.'
      }
  return res.json({ success: true, assistantResponse: assistantText, provider: 'openrouter', providerModel: modelName, raw: oresp })
    } catch (err) {
      const provStatus = err && err.response && err.response.status
      const provData = err && err.response && err.response.data
      console.error('OpenRouter API error during query:', provStatus || err.message, provData || err)

      // Retry condition: provider says developer instruction is not enabled
      try {
        const provText = provData ? (typeof provData === 'string' ? provData : JSON.stringify(provData)) : ''
        if (provText.includes('Developer instruction is not enabled')) {
          console.log('Retrying OpenRouter query call without developer instructions (merging system+user into one user message)')
          const mergedPayload = {
            model: modelName,
            messages: [ { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` } ],
            max_tokens: 800
          }
          const retryResp = await axios.post(tryUrl, mergedPayload, { headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json' }, timeout: 90000 })
          const rdata = retryResp.data
          // extract assistant text
          let assistantText2 = null
          if (rdata) {
            if (Array.isArray(rdata.choices) && rdata.choices[0]) {
              const ch2 = rdata.choices[0]
              if (ch2.message) {
                if (typeof ch2.message === 'string') assistantText2 = ch2.message
                else if (typeof ch2.message.content === 'string') assistantText2 = ch2.message.content
                else if (Array.isArray(ch2.message.content)) assistantText2 = ch2.message.content.map(c => (c.text || c)).join('\n')
              } else if (typeof ch2.text === 'string') assistantText2 = ch2.text
            }
            if (!assistantText2 && rdata.output && Array.isArray(rdata.output) && rdata.output[0] && rdata.output[0].content) assistantText2 = rdata.output[0].content.map(p => p.text || p).join('\n')
            if (!assistantText2) {
              if (rdata.result && typeof rdata.result === 'string') assistantText2 = rdata.result
              else if (rdata.text && typeof rdata.text === 'string') assistantText2 = rdata.text
            }
          }
          if (!assistantText2) assistantText2 = 'I received your question but had trouble processing the response on retry. Please try again.'
          return res.json({ success: true, assistantResponse: assistantText2, provider: 'openrouter', providerModel: modelName, providerRetry: true, raw: rdata })
        }
      } catch (retryErr) {
        console.error('OpenRouter query retry failed:', retryErr && (retryErr.response ? retryErr.response.data : retryErr))
      }

      return res.json({ success: true, assistantResponse: null, warning: 'OpenRouter API call failed during query', providerError: { status: provStatus || null, dataSnippet: provData ? (typeof provData === 'string' ? provData.slice(0, 1000) : JSON.stringify(provData).slice(0, 1000)) : null } })
    }
  } catch (err) {
    console.error('PDF query error:', err && err.response ? err.response.data : err)
    res.status(500).json({ error: 'Failed to query PDF content', details: String(err) })
  }
})

module.exports = router;