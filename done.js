
const MIN_BET_AMOUNT = 20;
const MAX_BET_AMOUNT = 2000;
const matchesData = {};


function parseRoDateTime(dateStr) {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day);
}


function formatRoDateTime(dateObj) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat("ro-RO", options).format(dateObj);
}

const fetchMatches = async () => {
  try {
    const sheetUrl =
      "https://docs.google.com/spreadsheets/d/13OkmkMb4Bak7uLQ7TKvkAhvJ1DeBEO7GHi3Njl9tnDA/gviz/tq?tqx=out:csv&sheet=Sheet1";
    const response = await fetch(sheetUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch match data");
    }
    const textData = await response.text();
    const rows = textData.split("\n").slice(1);
    const matches = rows.map((row) => {
      const cols = row.split(",").map((col) => col.replace(/(^"|"$)/g, "")); // Remove quotes

      return {
        date: cols[0],
        startAt: cols[1],
        teamsA: cols[2],
        teamsB: cols[3],
        odds: {
          1: cols[4] !== "TBD" && cols[4] !== "" ? cols[4] : "TBD",
          X: cols[5] !== "TBD" && cols[5] !== "" ? cols[5] : "TBD",
          2: cols[6] !== "TBD" && cols[6] !== "" ? cols[6] : "TBD",
        },
        boostOdds: {
          1: cols[7] !== "TBD" && cols[7] !== "" ? cols[7] : "TBD",
          X: cols[8] !== "TBD" && cols[8] !== "" ? cols[8] : "TBD",
          2: cols[9] !== "TBD" && cols[9] !== "" ? cols[9] : "TBD",

        },
        id: cols[10] && cols[10] !== "" ? cols[10] : "TBD",
        sessionId: cols[11] && cols[11] !== "" ? String(cols[11]) : "TBD",
      };
    });

    // Filter out matches that have "TBD" or empty values for relevant fields
    const validMatches = matches.filter((match) => {
      return (
        match.date &&
        match.startAt &&
        match.teamsA &&
        match.teamsB &&
        match.odds["1"] !== "TBD" &&
        match.odds["X"] !== "TBD" &&
        match.odds["2"] !== "TBD" &&
        match.boostOdds["1"] !== "TBD" &&
        match.boostOdds["X"] !== "TBD" &&
        match.boostOdds["2"] !== "TBD" &&
        match.id !== "TBD" &&
        match.sessionId !== "TBD"
      );
    });
    // Sort the valid matches by date in ascending order
    validMatches.sort((a, b) => {
      const dateA = parseRoDateTime(a.date);
      const dateB = parseRoDateTime(b.date);
      return dateA - dateB; // Compare Date objects
    });

    console.log(validMatches, "Sorted valid matches");

    // Return only the last 3 matches after sorting
    return validMatches.slice(-1);
  } catch (error) {
    console.error("Error fetching matches:", error);
    alert("Failed to fetch match data. Please try again later.");
    return [];
  }
};

const renderMatches = async () => {
  const matches = await fetchMatches();
  console.log(matches);
  const formattedGameDates = formatRoDateTime(parseRoDateTime(matches[0].date));
  const currentDataGame = formatRoDateTime(new Date());

  console.log(formattedGameDates, "formattedGameDates");
  console.log(currentDataGame, "currentDataGame");
  console.log(formattedGameDates === currentDataGame, "===");

  if (formattedGameDates === currentDataGame) {
    console.log(
      formattedGameDates,
      currentDataGame,
      "test   console.log(test,)"
    );
  }

  const container = $("#insert-ticket");

  container.empty();
  matches.forEach((match) => {

    matchesData[match.id] = match;
 // Normalize team names by replacing spaces with underscores and converting to lowercase
 const teamANameFormatted = match.teamsA.toLowerCase().replace(/\s+/g, "-");
 console.log(teamANameFormatted)
 const teamBNameFormatted = match.teamsB.toLowerCase().replace(/\s+/g, "-");

 // Dynamically construct the image paths using match.id and formatted team names
 const teamAImage = `./assets/${teamANameFormatted}.png`;
 const teamBImage = `./assets/${teamBNameFormatted}.png`;

    const teamANameSplit = match.teamsA.includes(" ")
    ? match.teamsA.split(" ").join("<br>")
    : match.teamsA;

    const teamBNameSplit = match.teamsB.includes(" ")
    ? match.teamsB.split(" ").join("<br>")
    : match.teamsB;

    const card = $(`
    <div class="main-card">
        <div class="card-content">
          <div class="header-ticket">
           Biletul tau
          </div>
          <div class="body-ticket">
            <div>
              <div class="teams"><img src="${teamAImage}" alt="teamA" class="teamA"><p>${teamANameSplit}</p></div>
              <p>VS</p>
              <div class="teams"><img src="${teamBImage}" alt="teamB" class="teamB"><p>${teamBNameSplit}</p></div>
            </div>
            <div>
                <p>ora: ${match.startAt}</p> <p>${match.date}</p>
            </div>
            <div class="bet-ticket">
                <div class="bet-option" data-id="${match.id}" data-choice="1">
                  <div><p>1</p> <p class="underline">${match.odds["1"]}</p> <p>${match.boostOdds["1"]}</p></div>
                </div>
                <div class="bet-option" data-id="${match.id}" data-choice="X">
                  <div><p>X</p> <p class="underline">${match.odds["X"]}</p> <p>${match.boostOdds["X"]}</p></div>
                </div>
                <div class="bet-option" data-id="${match.id}" data-choice="2">
                  <div><p>2</p> <p class="underline">${match.odds["2"]}</p> <p>${match.boostOdds["2"]}</p></div>
                </div>
            </div>
             <div><p>introdu miza</p> 
             		<form class="form-ticket">
                <input type="number" min="${MIN_BET_AMOUNT}" max="${MAX_BET_AMOUNT}" placeholder="${MIN_BET_AMOUNT} RON" id="bet-amount" class="form__field" disabled>            
                </form>
             </div>
            <p class="error-message" style="color:red; display:none;">Valoarea pariului trebuie să fie între 20 și 2000 RON.</p>
          </div>
          <div class="footer-ticket">
          <p id="potentialWinning">afla castigul potential </br> Selecteaza o cota</p>
          </div>
        </div>
    </div>
`);
    container.append(card);
    // const potentialWinning = (
    //   parseFloat(match.boostOdds["1"]) * MIN_BET_AMOUNT
    // ).toFixed(0);
    // card.find("#potentialWinning").text(`castig potential: ${potentialWinning} RON`);
  });


 // Event listener for bet option clicks

 container.on("click", ".bet-option", function () {
  const matchId = $(this).data("id");
  const choice = $(this).data("choice");
  const selectedMatch = matchesData[matchId];
  
  // Remove previously selected bets and add selected class to the current one
  $(this).closest('.main-card').find('.bet-option').removeClass('selected-bet');
  $(this).addClass('selected-bet');
  
  if (selectedMatch) {
    const boostOdds = selectedMatch.boostOdds[choice];
    const numericOdds = parseFloat(boostOdds);

    // Enable the bet input when an odd is selected
    const betAmountInput = $(this).closest('.main-card').find(`#bet-amount`);
    betAmountInput.prop('disabled', false);

    let betAmount = parseFloat(betAmountInput.val()) || MIN_BET_AMOUNT;

    // Function to update the potential winnings
    function updatePotentialWinning(betAmountToUse) {
      const potentialWinning = (numericOdds * betAmountToUse).toFixed(0);
      $(this).closest('.main-card').find(`#potentialWinning`).html(`castig potential <br> <p>${potentialWinning} RON</p>`);
    }

    // Initial calculation based on the bet amount
    if (betAmount < MIN_BET_AMOUNT) {
      updatePotentialWinning.call(this, MIN_BET_AMOUNT);
      $(this).closest('.main-card').find('.error-message').show();
    } else if (betAmount > MAX_BET_AMOUNT) {
      updatePotentialWinning.call(this, MAX_BET_AMOUNT);
      $(this).closest('.main-card').find('.error-message').show();
    } else {
      updatePotentialWinning.call(this, betAmount);
      $(this).closest('.main-card').find('.error-message').hide();
    }

    // Function to handle bet amount changes
    function handleBetAmountChange() {
      const inputBetAmount = parseFloat(betAmountInput.val()) || MIN_BET_AMOUNT;
      
      if (inputBetAmount < MIN_BET_AMOUNT) {
        // If below minimum, calculate with MIN_BET_AMOUNT and show error
        updatePotentialWinning.call(this, MIN_BET_AMOUNT);
        $(this).closest('.main-card').find('.error-message').show();
      } else if (inputBetAmount > MAX_BET_AMOUNT) {
        // If above maximum, calculate with MAX_BET_AMOUNT and show error
        updatePotentialWinning.call(this, MAX_BET_AMOUNT);
        $(this).closest('.main-card').find('.error-message').show();
      } else {
        // If within valid range, use the entered value
        updatePotentialWinning.call(this, inputBetAmount);
        $(this).closest('.main-card').find('.error-message').hide();
      }
    }

    // Listen to input changes to update potential winnings
    betAmountInput.off("input").on("input", handleBetAmountChange.bind(this));

    // Handle changes from +1 and -1 buttons (if they exist)
    // $(this).closest('.main-card').find('.increment-button, .decrement-button').off("click").on("click", function () {
    //   handleBetAmountChange.call(this);
    // }.bind(this));
  }
});


};


function flipdownJs() {
  const toDayFromNow = (new Date("Oct 24, 2024 23:59:59").getTime() / 1000) + (3600 / 60 / 60 / 24) - 1;
  const flipdown = new FlipDown(toDayFromNow)
  .start()
  .ifEnded(() => {
      document.querySelector(".flipdown").innerHTML = `<h2>Oferta a expirat</h2>`;
  });
}
  



$(document).ready(function(){
  flipdownJs();
  renderMatches();
});
