const listEl = document.getElementById('word-list');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');

function renderWords(words) {
  listEl.innerHTML = '';
  words.reverse().forEach(entry => {
    const card = document.createElement('div');
    card.className = 'word-card';
    card.innerHTML = `
      <h2>${entry.word}</h2>
      <p>${entry.meaning}</p>
      <small>Added: ${new Date(entry.timestamp).toLocaleString()}</small>
    `;
    listEl.appendChild(card);
  });
}

// Load dictionary from storage
function loadDictionary() {
  chrome.storage.local.get({dictionary: []}, (res) => {
    renderWords(res.dictionary);
  });
}

// Clear all words
clearBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear your dictionary?")) {
    chrome.storage.local.set({dictionary: []}, () => {
      renderWords([]);
    });
  }
});

// Export dictionary to JSON
exportBtn.addEventListener('click', () => {
  chrome.storage.local.get({dictionary: []}, (res) => {
    const dataStr = JSON.stringify(res.dictionary, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_dictionary_backup.json';
    a.click();
    URL.revokeObjectURL(url);
  });
});

loadDictionary();
