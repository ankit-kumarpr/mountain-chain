const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs"); // <-- THIS LINE WAS MISSING. THIS IS THE DEFINITIVE FIX.

// --- Helper Functions ---
const formatCurrency = (amount) =>
  amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "N/A";

const formatDate = (date, options = { year: "numeric", month: "long", day: "numeric" }) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", options);
};

const createPdf = async (quote) => {
  let browser;
  try {
    console.log("--- PDF Service Started ---");
    
    // Use your main production template
    const templatePath = path.join(__dirname, "../templates/quotation.template.ejs");

    console.log("Attempting to read template from:", templatePath);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Template file not found at path: ${templatePath}`);
    }

    const dataForTemplate = {
      quote: quote,
      formatCurrency: formatCurrency,
      formatDate: formatDate,
    };

    console.log("Rendering EJS template...");
    const html = await ejs.renderFile(templatePath, dataForTemplate);
    console.log("EJS rendering successful.");

    console.log("Launching Puppeteer...");
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    console.log("Puppeteer launched successfully.");
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    console.log("HTML content set on page.");

    console.log("Generating PDF buffer...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", bottom: "30px", left: "20px", right: "20px" },
    });
    console.log("PDF buffer generated. Length:", pdfBuffer.length);

    if (!pdfBuffer || pdfBuffer.length < 100) {
      throw new Error("Puppeteer produced an empty or invalid PDF buffer.");
    }
    
    console.log("--- PDF Service Successful ---");
    return pdfBuffer;

  } catch (err) {
    console.error("--- CRITICAL ERROR IN PDF SERVICE ---", err);
    throw err;
  } finally {
    if (browser) {
      console.log("Closing browser.");
      await browser.close();
    }
  }
};

module.exports = { createPdf };