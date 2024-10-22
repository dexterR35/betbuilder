
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

const username = getCookie("netbet_login");
const cookie_id = getCookie("netbet_id");
const netbet_id = parseInt(cookie_id);

function sendAuthStatus() {
  const isLoggedIn = !!(username && !isNaN(netbet_id));
  const message = {
    event: "auth_status",
    details: {
      isLoggedIn: isLoggedIn
    },
    source: "game.netbet"
  }
  window.postMessage(message, "https://casino.netbet.ro");
  console.log("Auth status sent:", message);
}

function listenForAuthStatus() {
  window.addEventListener("message", function (event) {
    if (event.origin !== "https://casino.netbet.ro") return;
    const message = event.data;
    if (message.event === "auth_status") {
      console.log("Auth status received:", message.details.isLoggedIn);
    }
  });
}

listenForAuthStatus();
sendAuthStatus();


// const iframe = document.getElementById('advent_iframe')
// iframe.contentWindow.postMessage({
//         "event": "auth_status",
//         "details": {
//             "isLoggedIn": true //boolean value
//         },
//         "source": "game.netbet"
//     },
//     "https://casino-promo.netbet.ro/batalia-streamerilor2024/index2.php"
// );