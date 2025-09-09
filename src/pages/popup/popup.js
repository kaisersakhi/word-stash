function renderList(latestFive) {
  const list = document.getElementById('list');
  const empty = document.getElementById('empty');
  list.innerHTML = '';

  if (!latestFive.length) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  latestFive.forEach(entry => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <h4 class="title">${entry.word}</h4>
      <p class="meaning">${entry.meaning}</p>
    `;
    list.appendChild(item);
  });
}

function openDictionaryTab() {
  const url = chrome.runtime.getURL('src/pages/newtab/dictionary.html');
  chrome.tabs.create({url});
}

document.getElementById('open-dictionary').addEventListener('click', openDictionaryTab);
document.getElementById('see-all').addEventListener('click', openDictionaryTab);

// Double-click lookup toggle functionality
const doubleClickToggle = document.getElementById('double-click-toggle');
doubleClickToggle.addEventListener('click', () => {
  chrome.storage.local.get({doubleClickLookup: true}, (result) => {
    const newValue = !result.doubleClickLookup;
    chrome.storage.local.set({doubleClickLookup: newValue}, () => {
      doubleClickToggle.classList.toggle('active', newValue);
    });
  });
});

// Auto-save toggle functionality
const autoSaveToggle = document.getElementById('auto-save-toggle');
autoSaveToggle.addEventListener('click', () => {
  chrome.storage.local.get({autoSaveOnLookup: false}, (result) => {
    const newValue = !result.autoSaveOnLookup;
    chrome.storage.local.set({autoSaveOnLookup: newValue}, () => {
      autoSaveToggle.classList.toggle('active', newValue);
    });
  });
});

// Load settings
chrome.storage.local.get({doubleClickLookup: true, autoSaveOnLookup: false}, (result) => {
  doubleClickToggle.classList.toggle('active', result.doubleClickLookup);
  autoSaveToggle.classList.toggle('active', result.autoSaveOnLookup);
});

chrome.storage.local.get({dictionary: []}, (res) => {
  const sorted = [...res.dictionary].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestFive = sorted.slice(0, 5);
  renderList(latestFive);
});

