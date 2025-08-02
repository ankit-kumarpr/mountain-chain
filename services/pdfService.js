const ejs = require("ejs");
const puppeteer = require("puppeteer");
const path = require("path");

const formatCurrency = (amount) =>
  amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "N/A";

const formatDate = (date, options = { year: "numeric", month: "short", day: "numeric" }) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", options);
};

const createCoverPage = (quote) => {
  const startDateFormatted = formatDate(quote.startDate, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `
    <div class="cover-page">
      <div class="cover-content">
        <img src="https://via.placeholder.com/200x80?text=Your+Logo" alt="Company Logo" class="cover-logo"/>
        <h1>${quote.queryId?.destination?.name ?? "Tour Quotation"}</h1>
        <h2>${quote.queryId?.guestName ?? "Valued Guest"}</h2>
        <p>Travel Dates: ${startDateFormatted}</p>
        <p>Quotation ID: ${quote.quoteId}</p>
        <p style="margin-top: 30px; font-size: 12px;">Mountains Chain Travel</p>
      </div>
    </div>
  `;
};

const createHotelSection = (hotelDetails) => {
  if (!hotelDetails?.entries?.length) return "<p>No hotel data provided.</p>";
  return `
    <div class="section">
      <h3>Hotel Details</h3>
      <ul>
        ${hotelDetails.entries
          .map(
            (entry) => `
            <li>
              ${entry.hotelName || "Unnamed Hotel"} - ${entry.hotelId?.city || "Unknown City"}, ${entry.hotelId?.state || ""}
              <br/>Rooms: ${entry.roomType || "N/A"} | Meal: ${entry.mealPlan || "N/A"}
            </li>`
          )
          .join("")}
      </ul>
    </div>
  `;
};

const createItinerarySection = (dayWiseItinerary) => {
  if (!Array.isArray(dayWiseItinerary) || dayWiseItinerary.length === 0)
    return "<p>No itinerary provided.</p>";

  return `
    <div class="section">
      <h3>Day Wise Itinerary</h3>
      ${dayWiseItinerary
        .map(
          (day, index) => `
        <div class="itinerary-day">
          <strong>Day ${index + 1}:</strong> ${day.title || "Untitled"}
          <p>${day.description || ""}</p>
        </div>`
        )
        .join("")}
    </div>
  `;
};

const createInclusionsSection = (data = {}) => {
  const { inclusions = [], exclusions = [], notes = [] } = data;

  return `
    <div class="section">
      <h3>Inclusions & Exclusions</h3>
      <div class="inclusions">
        <strong>Inclusions:</strong>
        <ul>${inclusions.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      <div class="exclusions">
        <strong>Exclusions:</strong>
        <ul>${exclusions.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
      ${
        notes?.length
          ? `<div class="notes"><strong>Notes:</strong><ul>${notes.map(
              (n) => `<li>${n}</li>`
            )}</ul></div>`
          : ""
      }
    </div>
  `;
};

const createPdf = async (quote) => {
  const templatePath = path.join(__dirname, "../templates/quotation.template.ejs");

  const data = {
    coverPage: createCoverPage(quote),
    quoteId: quote.quoteId,
    destination: quote.queryId?.destination?.name ?? "Tour",
    guestName: quote.queryId?.guestName ?? "Valued Guest",
    startDate: formatDate(quote.startDate),
    duration: quote.duration ?? "N/A",
    pax: `${quote.pax ?? "N/A"} Adults, ${quote.queryId?.childrenAges?.length ?? 0} Child(ren)`,
    tripId: quote.queryId?.queryId ?? "N/A",
    referenceId: quote.queryId?.referenceId ?? "N/A",
    totalSellingPrice: formatCurrency(quote.summary?.totalSellingPrice),
    hotelSection: createHotelSection(quote.hotelDetails),
    itinerarySection: createItinerarySection(quote.dayWiseItinerary),
    inclusionsExclusionsSection: createInclusionsSection(quote.inclusionsExclusions),
  };

  const html = await ejs.renderFile(templatePath, data);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", bottom: "30px", left: "20px", right: "20px" },
    });

    return pdf; // return buffer here
  } catch (err) {
    console.error("Error generating PDF with Puppeteer:", err);
    throw err;
  } finally {
    await page.close();
    await browser.close();
  }
};

module.exports = { createPdf };
