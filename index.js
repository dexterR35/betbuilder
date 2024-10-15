let isModalOpen = false;

const fetchMatches = async () => {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/13OkmkMb4Bak7uLQ7TKvkAhvJ1DeBEO7GHi3Njl9tnDA/gviz/tq?tqx=out:csv&sheet=Sheet1"; // Google Sheets CSV link

  const response = await fetch(sheetUrl);
  const textData = await response.text();

  const rows = textData.split("\n").slice(1); // Remove header row
  const matches = rows.map((row) => {
    const cols = row.split(",").map((col) => col.replace(/(^"|"$)/g, "")); // Remove surrounding quotes

    return {
      date: cols[0], // Match date as string
      startAt: cols[1],
      teams: `${cols[2]} vs ${cols[3]}`,
      odds: {
        1: cols[4] !== "TBD" ? cols[4] : "TBD",
        X: cols[5] !== "TBD" ? cols[5] : "TBD",
        2: cols[6] !== "TBD" ? cols[6] : "TBD",
      },
      boostOdds: {
        1: cols[7] !== "TBD" ? cols[7] : "TBD",
        X: cols[8] !== "TBD" ? cols[8] : "TBD",
        2: cols[9] !== "TBD" ? cols[9] : "TBD",
      },
      id: cols[10] ? cols[10] : "TBD", // EventID
    };
  });

  return matches;
};

const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${month}.${day}.${year}`; // Romanian format: mm.dd.yyyy
};

const renderMatches = async () => {
  const matches = await fetchMatches();

  // Sort matches by date
  matches.sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log(matches, "matches");

  const limitedMatches = matches.slice(0, 4);

  const container = $("#matches-container");
  container.empty();

  let hasMainCard = false;
  let secondaryCardsContainer = $(
    '<div class="secondary-cards-container"></div>'
  );

  limitedMatches.forEach((match) => {
    if (!hasMainCard) {
      const mainCard = $(`
        <div class="main-card">
            <div class="card-content">
                <div class="info">
                    <p class="t-teams">${match.teams} </p>
                    <p>${match.date}</p> <!-- Formatted date -->
                    <p>${match.startAt}</p>
                  <p>id :${match.id}</p>
                </div>
                <div class="bet_c">
                    <div class="bet-option" 
                        data-id="${match.id}" 
                        data-teams="${match.teams}" 
                        data-choice="1" 
                        data-odds="${match.odds["1"] || "TBD"}"
                        data-boost-odds="${match.boostOdds["1"] || "TBD"}">
                        <div><p>1</p> <p>${match.odds["1"] || "TBD"}</p></div>
                    </div>
                    <div class="bet-option" 
                        data-id="${match.id}" 
                        data-teams="${match.teams}" 
                        data-choice="X" 
                        data-odds="${match.odds["X"] || "TBD"}"
                        data-boost-odds="${match.boostOdds["X"] || "TBD"}">
                        <div><p>X</p> <p>${match.odds["X"] || "TBD"}</p></div>
                    </div>
                    <div class="bet-option" 
                        data-id="${match.id}" 
                        data-teams="${match.teams}" 
                        data-choice="2" 
                        data-odds="${match.odds["2"] || "TBD"}"
                        data-boost-odds="${match.boostOdds["2"] || "TBD"}">
                        <div><p>2</p> <p>${match.odds["2"] || "TBD"}</p></div>
                    </div>
                </div>
            </div>
        </div>
      `);
      container.append(mainCard);
      hasMainCard = true;
    } else {
      const secondaryCard = $(`
        <div class="secondary-card">
            <div class="card-content">
                <div class="info">
                    <p class="t-teams">${match.teams} </p>
                    <p>${match.date}</p> <!-- Formatted date -->
                    <p>${match.startAt}</p>
               <p>id: ${match.id} </p>
                </div>
                <div class="bet_c">
                    <div class="bet-option" 
                        data-id="${match.id}" 
                        data-teams="${match.teams}" 
                        data-choice="1" 
                        data-odds="${match.odds["1"] || "TBD"}"
                        data-boost-odds="${match.boostOdds["1"] || "TBD"}">
                        <div><p>1</p> <p>${match.odds["1"] || "TBD"}</p></div>
                    </div>
                    <div class="bet-option" 
                        data-id="${match.id}" 
                        data-teams="${match.teams}" 
                        data-choice="X" 
                        data-odds="${match.odds["X"] || "TBD"}"
                        data-boost-odds="${match.boostOdds["X"] || "TBD"}">
                        <div><p>X</p> <p>${match.odds["X"] || "TBD"}</p></div>
                    </div>
                    <div class="bet-option" 
                        data-id="${match.id}" 
                        data-teams="${match.teams}" 
                        data-choice="2" 
                        data-odds="${match.odds["2"] || "TBD"}"
                        data-boost-odds="${match.boostOdds["2"] || "TBD"}">
                        <div><p>2</p> <p>${match.odds["2"] || "TBD"}</p></div>
                    </div>
                </div>
            </div>
        </div>
      `);
      secondaryCardsContainer.append(secondaryCard);
    }
  });

  container.append(secondaryCardsContainer);

  $(".bet-option").on("click", function () {
    const teams = $(this).data("teams");
    const betType = $(this).data("choice");
    const odds = $(this).data("odds") || "N/A"; // Fallback to "N/A" if odds is empty
    const boostOdds = $(this).data("boost-odds") || "N/A"; // Fallback to "N/A" if boost odds is empty
    const ids = $(this).data("id");

    console.log(
      `Selected Teams: ${teams}, Bet Type: ${betType}, Odds: ${odds}, Boosted Odds: ${boostOdds}`
    );

    selectBet(teams, betType, odds, boostOdds, ids);
  });
};

const selectBet = (teams, betType, odds, boostOdds, ids) => {
  if (isModalOpen) {
    return;
  }
  const popup = $("#popup");
  const selectedInfo = $("#selected-info");

  const ticketContent = `
    <h3>Bilet Pariu ${ids}</h3>
    <p><strong>Meci:</strong> ${teams}</p>
    <p><strong>Tip pariu:</strong> ${betType}</p>
    <p><strong>Cotă standard:</strong> ${odds}</p>
    <p><strong>Cotă boostată:</strong> ${boostOdds}</p>
  `;
  selectedInfo.html(ticketContent);

  popup.show();
  isModalOpen = true;

  // Show "Generate Image" button and hide "Download Image" initially
  $("#generate-img-btn").show();
  $("#download-img-btn").hide();
};

// Function to generate the ticket image
const generateTicketImage = (teams, betType, odds, boostOdds, ids) => {
  const canvas = document.getElementById('ticket-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 400;
  canvas.height = 300;

  // Background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText('Bilet Pariu ' + ids, 20, 40);
  ctx.font = '16px Arial';
  ctx.fillText(`Meci: ${teams}`, 20, 80);
  ctx.fillText(`Tip pariu: ${betType}`, 20, 110);
  ctx.fillText(`Cota standard: ${odds}`, 20, 140);
  ctx.fillText(`Cota boostata: ${boostOdds}`, 20, 170);

  const currentDate = new Date().toLocaleDateString('ro-RO');
  ctx.fillText(`Data generarii: ${currentDate}`, 20, 200);

  $("#download-img-btn").show();
  $("#generate-img-btn").hide();
};

// Event listener for "Generate Image" button
$("#generate-img-btn").on("click", function () {
  const teams = $("#selected-info").find("p").eq(0).text().split(": ")[1];
  const betType = $("#selected-info").find("p").eq(1).text().split(": ")[1];
  const odds = $("#selected-info").find("p").eq(2).text().split(": ")[1];
  const boostOdds = $("#selected-info").find("p").eq(3).text().split(": ")[1];
  const ids = $("#selected-info").find("h3").text().split(" ")[2];

  generateTicketImage(teams, betType, odds, boostOdds, ids);
});

// Event listener for "Download Image" button
$("#download-img-btn").on("click", function () {
  const canvas = document.getElementById('ticket-canvas');
  const image = canvas.toDataURL('image/png');
  const link = document.getElementById('download-link');
  link.href = image;
  link.download = 'ticket.png';
  link.click(); // Trigger download
});

const closePopup = () => {
  const popup = $("#popup");
  popup.hide();
  isModalOpen = false;
};

$("#close-popup-btn").on("click", closePopup);

$(document).ready(renderMatches);

$("#share-btn").on("click", () => {
  const fbShareURL = `https://www.facebook.com/sharer/sharer.php`;
  window.open(fbShareURL, "_blank");
});
