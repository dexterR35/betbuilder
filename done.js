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

const matchesData = {};

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

  // Parse the dates and sort them in ascending order

  const container = $("#insert-ticket");
  container.empty();

  matches.forEach((match) => {
    matchesData[match.id] = match;
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
            <div class="d-between">
              <p class="t-teams"><img src="#"> ${teamANameSplit}</p>
              <p>-</p>
              <p class="t-teams">${teamBNameSplit} <img src="#"> </p>
            </div>
            <div class="d-between">
                <p>${match.startAt}</p> <p>${match.date}</p>
            </div>
            <div class="bet-ticket d-between">
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
            <div class="d-between"><p>introdu miza</p> <input type="numer" placeholder="20RON"></div>
          </div>
          <div class="footer-ticket">
          <p>castig potential </p>
          <p>320ron</p>
          </div>
        </div>
    </div>
`);
    container.append(card);
  });

  container.on("click", ".bet-option", function () {
    if (isModalOpen) return;
    const matchId = $(this).data("id");
    const choice = $(this).data("choice");
    const selectedMatch = matchesData[matchId];
    if (selectedMatch) {
      const teams = `${selectedMatch.teamsA} vs ${selectedMatch.teamsB}`;
      const odds = selectedMatch.odds[choice];
      const boostOdds = selectedMatch.boostOdds[choice];
      selectBet(
        teams,
        choice,
        odds,
        boostOdds,
        matchId,
        selectedMatch.sessionId
      );
    }
  });
};
$(document).ready(renderMatches);
