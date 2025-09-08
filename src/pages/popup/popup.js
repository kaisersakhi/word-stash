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

chrome.storage.local.get({dictionary: []}, (res) => {
  const sorted = [...res.dictionary].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const latestFive = sorted.slice(0, 5);
  renderList(latestFive);
});

