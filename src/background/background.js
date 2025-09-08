chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveWord",
    title: "Save to Word Stash",
    contexts: ["selection"]
  });
});

async function fetchMeaning(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    if (data[0] && data[0].meanings && data[0].meanings[0]) {
      return data[0].meanings[0].definitions[0].definition;
    }
    return "Meaning not found.";
  } catch (err) {
    return "Error fetching meaning.";
  }
}

async function saveWord(word) {
  const meaning = await fetchMeaning(word);
  chrome.storage.local.get({dictionary: []}, (res) => {
    const updated = [...res.dictionary, {word, meaning, timestamp: new Date().toISOString()}];
    chrome.storage.local.set({dictionary: updated});
  });
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "saveWord" && info.selectionText) {
    saveWord(info.selectionText.trim());
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "save-word") {
    chrome.scripting.executeScript({
      target: {tabId: chrome.tabs.TAB_ID_PLACEHOLDER},
      func: () => window.getSelection().toString()
    }, async (selection) => {
      const word = selection[0].result.trim();
      if (word) saveWord(word);
    });
  }
});


// chrome.action.onClicked.addListener(() => {
//   chrome.tabs.create({url: chrome.runtime.getURL("dictionary.html")});
// });


