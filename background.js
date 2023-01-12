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
    id: "save-to-anki",
    title: "Save to Anki",
    contexts: ["selection"]
  }
);

browser.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId == "save-to-anki") {
    const ip_port = "http://" + localStorage.getItem("ip") + ":" + localStorage.getItem("port");
    const request = { action: "addNote",
                      version: 6,
                      params: {
                        note: {
                          deckName: "foobar",
                          modelName: "Basic",
                          fields: {
                            Front: "fronto",
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
        if (response.result == null) {
          browser.notifications.create({
            type: "basic",
            message: "Failed to add note to deck.",
            title: "ankiff - Error"
          });
        }
      })
      .then((error) => console.error(error));
  }
});
