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
}

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

function populateDecks() {
  const ip_port = "http://" + localStorage.getItem("ip") + ":" + localStorage.getItem("port");
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
    .then((error) => console.error(error));

}

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  const ip_port = "http://" + localStorage.getItem("ip") + ":" + localStorage.getItem("port");
  const request = {
    action: "addNote",
    version: 6,
    params: {
      note: {
        deckName: info.menuItemId,
        modelName: "Basic",
        fields: {
          Front: info.selectionText,
          Back: "backo"
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
    .then((response) => {
      if (response.result === null) {
        browser.notifications.create({
          type: "basic",
          message: "Failed to add note to deck.",
          title: "ankiff - Error"
        });
      }
    })
    .then((error) => console.error(error));
});
