const listEl = document.getElementById('word-list');
const clearBtn = document.getElementById('clear');
const exportBtn = document.getElementById('export');

function renderWords(words) {
  listEl.innerHTML = '';
  words.reverse().forEach((entry, index) => {
    const card = document.createElement('div');
    card.className = 'word-card';

    card.innerHTML = `
      <h2>${entry.word}</h2>
      <p class="meaning">${entry.meaning}</p>
      <textarea class="edit-area" style="display:none;width:100%;">${entry.meaning}</textarea>
      <small>Added: ${new Date(entry.timestamp).toLocaleString()}</small>
      <div class="actions">
        <button class="edit-btn">Edit</button>
        <button class="save-btn" style="display:none;">Save</button>
      </div>
    `;

    // Edit button
    card.querySelector('.edit-btn').addEventListener('click', () => {
      card.querySelector('.meaning').style.display = 'none';
      card.querySelector('.edit-area').style.display = 'block';
      card.querySelector('.edit-btn').style.display = 'none';
      card.querySelector('.save-btn').style.display = 'inline-block';
    });

    // Save button
    card.querySelector('.save-btn').addEventListener('click', () => {
      const newMeaning = card.querySelector('.edit-area').value.trim();
      if (!newMeaning) return;

      // Update storage
      chrome.storage.local.get({dictionary: []}, (res) => {
        let dict = res.dictionary;
        // match by word & timestamp to be safe
        const target = dict.find(d => d.word === entry.word && d.timestamp === entry.timestamp);
        if (target) target.meaning = newMeaning;

        chrome.storage.local.set({dictionary: dict}, () => {
          loadDictionary();
        });
      });
    });

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
