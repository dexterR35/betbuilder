// Firebase configuration

      // Import the functions you need from the SDKs you need
      import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      const firebaseConfig = {
        apiKey: "AIzaSyAjgn2sejJxAyiE1mOitaZo7l6RwPyw_uY",
        authDomain: "nbsportnb.firebaseapp.com",
        projectId: "nbsportnb",
        storageBucket: "nbsportnb.appspot.com",
        messagingSenderId: "386727042279",
        appId: "1:386727042279:web:d39f4f6769b4df6369d642",
        measurementId: "G-D6XBGY7ZG4"
      };
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
     


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

  // Convert canvas to a data URL
  const imageDataURL = canvas.toDataURL('image/png');

  // Convert data URL to a Blob
  const byteString = atob(imageDataURL.split(',')[1]);
  const mimeString = imageDataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });

  // Upload the image Blob to Firebase Storage with the same ID
  const storageRef = storage.ref().child(`bet-tickets/${ids}.png`);
  storageRef.put(blob).then(async (snapshot) => {
    console.log('Uploaded a blob or file!');

    // Get the download URL
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log('File available at', downloadURL);

    // Store the download URL and other data in Firestore, using the same ID
    db.collection("tickets").doc(ids).set({
      teams: teams,
      betType: betType,
      odds: odds,
      boostOdds: boostOdds,
      ticketId: ids,
      imageUrl: downloadURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      console.log('Ticket data saved to Firestore.');

      // Enable the download and share button
      $("#download-img-btn").show();
      $("#generate-img-btn").hide();

      // Trigger Facebook share
      $("#share-btn").show();
      $("#share-btn").on("click", () => {
        const fbShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(downloadURL)}`;
        window.open(fbShareURL, "_blank");
      });
    }).catch((error) => {
      console.error("Error saving ticket to Firestore: ", error);
    });
  }).catch((error) => {
    console.error("Error uploading image to Firebase Storage: ", error);
  });
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

// Close popup function
const closePopup = () => {
  const popup = $("#popup");
  popup.hide();
  isModalOpen = false;
};

// Event listener for close button
$("#close-popup-btn").on("click", closePopup);

// Initialize the matches when the document is ready
$(document).ready(renderMatches);