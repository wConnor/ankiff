initSettings();

function initSettings() {
  let checkFirstTime = browser.storage.local.get(null);
  checkFirstTime.then((results) => {
    let settingsKeys = Object.keys(results);
    if (settingsKeys.length === 0) {
      localStorage.setItem("ip", "127.0.0.1");
      localStorage.setItem("port", "8765");
      localStorage.setItem("default_deck", "default");
    }
  });

  document.getElementById("ip").value = localStorage.getItem("ip");
  document.getElementById("port").value = localStorage.getItem("port");
}

document.getElementById("test-connection-btn").onclick = function () {
  const ip_port = "http://" + document.getElementById("ip").value + ":" + document.getElementbyId("port").value;
  const data = { action: "deckNames", version: 6 };

  fetch(ip_port, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (response.status === 200) {
        document.getElementById("connection-status").style.color = "green";
        document.getElementById("connection-status").innerHTML = "Success";
      } else {
        document.getElementById("connection-status").style.color = "red";
        document.getElementById("connection-status").innerHTML = "Failure";
      }
    })
    .then((error) => console.error(error));
};

document.getElementById("save-ac-settings").onclick = function () {
  localStorage.setItem("ip", document.getElementById("ip").value); 
  localStorage.setItem("port", document.getElementById("port").value); 
  localStorage.setItem("default_deck", "foobar");
  //  localStorage.setItem("default_deck", document.getElementById("default_deck").value); 
};
