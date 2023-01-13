browser.contextMenus.create(
  {
    id: "save-to-default-deck",
    title: "Save to deck '" + localStorage.getItem("default_deck") + "'",
    contexts: ["selection"]
  }
);

browser.contextMenus.create(
  {
    id: "separator-1",
    type: "separator",
    contexts: ["selection"]
  }
);

populateDecks();

async function populateDecks() {
  // temporary 'fix' until persistent settings implemented.
  localStorage.setItem("ip", "127.0.0.1");
  localStorage.setItem("port", "8765");
  localStorage.setItem("default_deck", "default");

  const ip = localStorage.getItem("ip");
  const port = localStorage.getItem("port");
  const ip_port = "http://" + ip + ":" + port;
  const request = { action: "deckNames", version: 6 };

  fetch(ip_port, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request)
  })
    .then((response) => response.json())
    .then((response) => {
      localStorage.setItem("decks", response.result);
      response.result.forEach(e => {
        browser.contextMenus.create(
          {
            id: e,
            title: "Save to deck '" + e + "'",
            contexts: ["selection"]
          }
        );
      });
    })
    .then((error) => {
      if (error != null) {
        console.error(error);
      }
    });
}

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  // possibly change key names to something less misleading..? current
  // names imply the addition of a new deck.
  localStorage.setItem("newDeck", info.menuItemId);
  localStorage.setItem("newFront", info.selectionText);

  browser.tabs.create({ url: "./new-note/new-note.html" });
});
