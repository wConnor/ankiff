// preferences functionality to be implemented later.
/*import prefs from "../prefs.json" assert { type: "JSON" };
 document.getElementById("ip").value = prefs.ac.ip;
 document.getElementById("port").value = prefs.ac.port; */

document.getElementById("connect-btn").onclick = function () {
  const ip_port = "http://" + document.getElementById("ip").value + ":" + document.getElementById("port").value;
  const data = { action: "deckNames", version: 6 };
  fetch(ip_port, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (response.status == 200) {
        document.getElementById("connection-status").style.color = "green";
        document.getElementById("connection-status").innerHTML = "Connected";
      } else {
        document.getElementById("connection-status").style.color = "red";
        document.getElementById("connection-status").innerHTML = "Disconnected";
      }
    })
    .then((error) => console.error(error));
};

