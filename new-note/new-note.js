populateFields();

// very poor solution! decks containing a comma in their name may cause this function to
// produce very unexpected results. ought to be rewritten in a way that can avoid this.
function populateFields() {
  const decks = localStorage.getItem("decks");
  var json = [];
  var toSplit = decks.split(",");

  for (var i = 0; i < toSplit.length; i++) {
    json.push({ "deck": toSplit[i] });
  }

  var select = document.getElementById("deckList");
  for (var i = 0; i < json.length; i++) {
    var opt = json[i].deck;
    var el = document.createElement("option");
    el.text = opt;
    el.value = opt;

    select.add(el);
  }

  select.value = localStorage.getItem("newDeck");
  document.getElementById("front").value = localStorage.getItem("newFront");;
}

document.getElementById("wiktionary-retrieve-btn").onclick = async function () {
  const lang = document.getElementById("lang").value;

  // TODO: implement means of retrieving definitions from wiktionary. may require
  // the use of web-scraping as a public API doesn't seem to be available.

};

document.getElementById("create-note-btn").onclick = async function () {
  const deck = document.getElementById("deckList").value;
  const front = document.getElementById("front").value;
  const back = document.getElementById("back").value;

  const ip_port = "http://" + localStorage.getItem("ip") + ":" + localStorage.getItem("port");
  const request = {
    action: "addNote",
    version: 6,
    params: {
      note: {
        deckName: deck,
        modelName: "Basic",
        fields: {
          Front: front,
          Back: back
        }
      }
    }
  };
  fetch(ip_port, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request)
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.result === null) {
        browser.notifications.create({
          type: "basic",
          message: "Failed to add note to deck.",
          title: "ankiff - Error"
        });
      } else {
        browser.notifications.create({
          type: "basic",
          message: "Successfully saved note '" + front + "' to deck '" + deck + "'.",
          title: "ankiff - Saved Note"
        });
      }
      window.close();
    })
    .then((error) => {
      if (error != null) {
        console.error(error);
      }
    });
};

document.getElementById("cancel-btn").onclick = function () {
  window.close();
};
