const fetchMatches = async () => {
  return [
    {
      id: 1232001,
      teams: "Spania vs Franța",
      date: "12-10-2024",
      startAt: "12:10",
      odds: { 1: 3.12, X: 1.23, 2: 2.12 },
    },
    {
      id: 2010222,
      startAt: "22:10",
      teams: "Anglia vs Germania",
      date: "16-10-2024",
      odds: { 1: 2.5, X: 3.0, 2: 2.8 },
    },
    {
      id: 12022012,
      teams: "Italia vs Brazilia",
      date: "17-10-2024",
      startAt: "17:10",
      odds: { 1: 2.7, X: 2.9, 2: 2.5 },
    },
    {
      id: 4520011,
      startAt: "12:10",
      teams: "Franta vs Romania",
      date: "18-10-2024",
      odds: { 1: 2.7, X: 2.9, 2: 2.5 },
    },
  ];
};
let isModalOpen = false;
const parseDate = (dateString) => {
  // Check if the format is "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString);
  }
  // If format is "DD-MM-YYYY", convert to "YYYY-MM-DD"
  const parts = dateString.split("-");
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  // Fallback for invalid date formats
  console.error(`Invalid date format: ${dateString}`);
  return new Date();
};

// Helper function to format dates in Romanian time zone
const formatToRomanianTime = (date) => {
  return new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Helper to format any date into Romanian format
// Helper to format any date into Romanian format
const formatToRomanianDate = (dateInput) => {
  let dateObj;

  // Check if the input is a string in the format "DD-MM-YYYY"
  if (typeof dateInput === "string" && /^\d{2}-\d{2}-\d{4}$/.test(dateInput)) {
    const [day, month, year] = dateInput.split("-");
    // Convert to "YYYY-MM-DD" which the Date constructor understands
    const isoFormattedDate = `${year}-${month}-${day}`;
    dateObj = new Date(isoFormattedDate);
  } else {
    dateObj = new Date(dateInput); // Already a Date object
  }

  return new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
};

// Main function to render matches
const renderMatches = async () => {
  const matches = await fetchMatches();
  const container = $("#matches-container");
  container.empty();

  // Get current date and tomorrow's date in Romanian time and format them
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  // Format current and tomorrow's dates into Romanian format
  const roFormattedCurrentDate = formatToRomanianDate(currentDate);
  const roFormattedTomorrowDate = formatToRomanianDate(tomorrowDate);

  console.log(`Current Romanian Date: ${roFormattedCurrentDate}`);
  console.log(`Tomorrow's Romanian Date: ${roFormattedTomorrowDate}`);

  // Sort matches by date, but using our Romanian date formatting function
  const sortedMatches = matches.sort(
    (a, b) =>
      new Date(formatToRomanianDate(a.date)) -
      new Date(formatToRomanianDate(b.date))
  );

  // Logic to render main and secondary cards
  let hasMainCard = false;
  let secondaryCardsContainer = $(
    '<div class="secondary-cards-container"></div>'
  );

  sortedMatches.forEach((match) => {
    const matchDateFormatted = formatToRomanianDate(match.date);
    console.log(`Match Date (Formatted): ${matchDateFormatted}`);

    // Check if the match is for tomorrow
    if (!hasMainCard && matchDateFormatted === roFormattedTomorrowDate) {
      // Render the main card for the match that is happening tomorrow
      const mainCard = $(`
          <div class="main-card">
              <div class="card-content">
                  <div class="info">
                      <p class="t-teams">${match.teams}</p>
                      <p>${matchDateFormatted}</p>
                      <p>${match.startAt}</p>
                  </div>
                  <div class="bet_c">
                      <div class="bet-option" data-id="${match.id}" data-teams="${match.teams}" data-choice="1" data-odds="${match.odds["1"]}">
                          <div><p>1</p> <p>${match.odds["1"]}</p></div>
                      </div>
                      <div class="bet-option" data-id="${match.id}" data-teams="${match.teams}" data-choice="X" data-odds="${match.odds["X"]}">
                          <div><p>X</p> <p>${match.odds["X"]}</p></div>
                      </div>
                      <div class="bet-option" data-id="${match.id}" data-teams="${match.teams}" data-choice="2" data-odds="${match.odds["2"]}">
                          <div><p>2</p> <p>${match.odds["2"]}</p></div>
                      </div>
                  </div>
              </div>
          </div>
        `);
      container.append(mainCard);
      hasMainCard = true;
    } else {
      // Render the remaining matches as secondary cards
      const secondaryCard = $(`
          <div class="secondary-card">
              <div class="card-content">
                  <div class="info">
                      <p class="t-teams">${match.teams}</p>
                      <p>${matchDateFormatted}</p>
                      <p>${match.startAt}</p>
                  </div>
                  <div class="bet_c">
                      <div class="bet-option" data-id="${match.id}" data-teams="${match.teams}" data-choice="1" data-odds="${match.odds["1"]}">
                          <div><p>1</p> <p>${match.odds["1"]}</p></div>
                      </div>
                      <div class="bet-option" data-id="${match.id}" data-teams="${match.teams}" data-choice="X" data-odds="${match.odds["X"]}">
                          <div><p>X</p> <p>${match.odds["X"]}</p></div>
                      </div>
                      <div class="bet-option" data-id="${match.id}" data-teams="${match.teams}" data-choice="2" data-odds="${match.odds["2"]}">
                          <div><p>2</p> <p>${match.odds["2"]}</p></div>
                      </div>
                  </div>
              </div>
          </div>
        `);
      secondaryCardsContainer.append(secondaryCard);
    }
  });

  // Append the secondary cards container after the main card
  container.append(secondaryCardsContainer);
  $(".bet-option").on("click", function () {
    const teams = $(this).data("teams");
    const betType = $(this).data("choice");
    const odds = $(this).data("odds");
    const ids = $(this).data("id");

    selectBet(teams, betType, odds, ids);
  });
};

const selectBet = (teams, betType, odds, ids) => {
  if (isModalOpen) {
    return;
  }
  const popup = $("#popup");
  const selectedInfo = $("#selected-info");
  const ticket = generateTicket(teams, betType, odds, ids);

  selectedInfo.html(ticket);
  $("#qrcode").empty();

  const qrData = `${teams}`;

  if (qrData.length > 440) {
    console.error("Data too large to generate a QR code.");
    alert("Data too large to generate a QR code.");
    return;
  }

  // Generate the QR code
  new QRCode(document.getElementById("qrcode"), {
    text: qrData,
    width: 100, // QR code width
    height: 100, // QR code height
    correctLevel: QRCode.CorrectLevel.L,
  });
  popup.show();
  isModalOpen = true;
};

const generateTicket = (teams, betType, odds, ids) => {
  const currentDate = new Date().toLocaleString("ro-RO");
  return `
        <h3>Bilet Pariu ${ids}</h3>
        <p><strong>Meci:</strong> ${teams}</p>
        <p><strong>Tip pariu:</strong> ${betType}</p>
        <p><strong>Cotă:</strong> ${odds}</p>
        <p><strong>Data generării:</strong> ${currentDate}</p>
    `;
};

// Function to share on Facebook when button is clicked
$("#share-btn").on("click", async () => {
  const fbShareURL = `https://www.facebook.com/sharer/sharer.php`;
  window.open(fbShareURL, "_blank");
});

const closePopup = () => {
  const popup = $("#popup");
  popup.hide();
  isModalOpen = false;
};

$(document).ready(renderMatches);
