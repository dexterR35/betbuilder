



function getCookie(name) {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();  // trim to remove leading/trailing spaces
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;  // If cookie is not found
  } catch (error) {
    console.error("Error retrieving cookie:", error);
    return null;
  }
}

// Global constants
const token = "2f97bb641f2096c1e98a723c249a6ece";  // Ideally, use an environment variable, not hard-coded
const url = "https://admin.livepartners.com/api/streaming/";
const username = getCookie("netbet_login");
const cookie_id = getCookie("netbet_id");
const netbet_id = parseInt(cookie_id);

async function sendMessageBasedOnCookies() {
  try {
    const isLoggedIn = !!(username && !isNaN(netbet_id));
    const message = {
      event: "auth_status",
      details: {
        isLoggedIn: isLoggedIn,
        username: isLoggedIn ? username : null,
        netbet_id: isLoggedIn ? netbet_id : null,
      },
      source: "game.netbet",
    };
    // Send the message 
    window.postMessage(message, "https://casino.netbet.ro");
    console.log("Message sent:", message);
  } catch (error) {
    console.error("Error sending authentication message:", error);
  }
}

function listenMessage() {
  try {
    const trustedOrigins = ["https://casino.netbet.ro", "https://casino-promo.netbet.ro","https://login-ro.netbet.ro"];
    window.addEventListener("message", function (event) {
      if (!trustedOrigins.includes(event.origin)) {
        console.log("Untrusted origin:", event.origin);
        return;
      }
      const message = event.data;
      if (message && typeof message === "object" && message.event === "auth_status") {
        console.log("Authentication status received:", message.details.isLoggedIn);
        if (message.details.isLoggedIn) {
          console.log("User is logged in with username:", message.details.username);
        } else {
          console.log("User is not logged in.");
        }
      }
    }, false);
  } catch (error) {
    console.error("Error setting up message listener:", error);
  }
}

listenMessage();
