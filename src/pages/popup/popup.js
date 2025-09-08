function renderDictionary(words) {
  const container = document.getElementById('words');
  container.innerHTML = '';
  words.reverse().forEach(entry => {
    const div = document.createElement('div');
    div.className = 'word';
    div.innerHTML = `<strong>${entry.word}</strong>${entry.meaning}<br><small>${new Date(entry.timestamp).toLocaleString()}</small>`;
    container.appendChild(div);
  });
}

chrome.storage.local.get({dictionary: []}, (res) => {
  renderDictionary(res.dictionary);
});


