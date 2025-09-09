// Content script for double-click word lookup
let definitionPopup = null;
let isDoubleClickEnabled = true;

// Check if double-click lookup is enabled
chrome.storage.local.get({doubleClickLookup: true}, (result) => {
  isDoubleClickEnabled = result.doubleClickLookup;
});

// Listen for storage changes to update the setting
chrome.storage.onChanged.addListener((changes) => {
  if (changes.doubleClickLookup) {
    isDoubleClickEnabled = changes.doubleClickLookup.newValue;
  }
});

// Handle double-click events
document.addEventListener('dblclick', async (e) => {
  if (!isDoubleClickEnabled) {
    return;
  }
  
  // Don't prevent default - let text selection happen first
  // Use a small delay to allow text selection to complete
  setTimeout(async () => {
    const selection = window.getSelection();
    const word = selection.toString().trim();
    
    if (!word || word.length < 2) {
      return;
    }
    
    // Clean word (remove punctuation)
    const cleanWord = word.replace(/[^\w\s]/g, '');
    
    if (!cleanWord) {
      return;
    }
    
    // Show loading popup
    showDefinitionPopup(e.clientX, e.clientY, 'Loading...', true);
    
    try {
      // Try using the background script to fetch the definition
      // This avoids potential CORS issues with content scripts
      const response = await chrome.runtime.sendMessage({
        action: 'fetchDefinition',
        word: cleanWord
      });
      
      if (!response) {
        throw new Error('No response from background script');
      }
      
      let definition = "Meaning not found.";
      if (response && response.success && response.definition) {
        definition = response.definition;
      } else {
        if (response && response.error) {
          throw new Error(response.error);
        }
      }
      
      // Show definition popup
      showDefinitionPopup(e.clientX, e.clientY, definition, false, cleanWord);
      
      // Check if auto-save is enabled
      chrome.storage.local.get({autoSaveOnLookup: false}, (result) => {
        if (result.autoSaveOnLookup) {
          saveWordToDictionary(cleanWord, definition);
        }
      });
      
    } catch (error) {
      // Fallback: try direct fetch as a last resort
      try {
        const directResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
        const directData = await directResponse.json();
        
        let fallbackDefinition = "Meaning not found.";
        if (directData && directData.length > 0 && directData[0].meanings && directData[0].meanings[0]) {
          fallbackDefinition = directData[0].meanings[0].definitions[0].definition;
        }
        
        showDefinitionPopup(e.clientX, e.clientY, fallbackDefinition, false, cleanWord);
        
        // Check if auto-save is enabled
        chrome.storage.local.get({autoSaveOnLookup: false}, (result) => {
          if (result.autoSaveOnLookup) {
            saveWordToDictionary(cleanWord, fallbackDefinition);
          }
        });
        
      } catch (fallbackError) {
        showDefinitionPopup(e.clientX, e.clientY, `Error: ${error.message}`, false);
      }
    }
  }, 100); // Small delay to allow text selection
});

function showDefinitionPopup(x, y, text, isLoading = false, word = null) {
  // Remove existing popup
  if (definitionPopup) {
    definitionPopup.remove();
  }
  
  // Create popup element
  definitionPopup = document.createElement('div');
  definitionPopup.className = 'word-stash-definition-popup';
  definitionPopup.innerHTML = `
    <div class="popup-content">
      ${word ? `<div class="popup-word">${word}</div>` : ''}
      <div class="popup-definition">${text}</div>
      ${!isLoading && word ? `
        <div class="popup-links">
          <a href="https://www.google.com/search?q=define+${encodeURIComponent(word)}" target="_blank" class="google-search-link">More on Google</a>
        </div>
        <div class="popup-actions">
          <button class="save-btn">Save to Dictionary</button>
          <button class="close-btn">×</button>
        </div>
      ` : ''}
    </div>
  `;
  
  // Position popup
  const rect = document.body.getBoundingClientRect();
  const popupWidth = 300;
  const popupHeight = 150;
  
  let popupX = x;
  let popupY = y + 20;
  
  // Adjust if popup would go off screen
  if (popupX + popupWidth > window.innerWidth) {
    popupX = window.innerWidth - popupWidth - 10;
  }
  if (popupY + popupHeight > window.innerHeight) {
    popupY = y - popupHeight - 10;
  }
  
  definitionPopup.style.left = popupX + 'px';
  definitionPopup.style.top = popupY + 'px';
  
  document.body.appendChild(definitionPopup);
  
  // Add event listeners
  if (!isLoading && word) {
    const saveBtn = definitionPopup.querySelector('.save-btn');
    const closeBtn = definitionPopup.querySelector('.close-btn');
    
    saveBtn.addEventListener('click', () => {
      saveWordToDictionary(word, text);
      definitionPopup.remove();
      definitionPopup = null;
    });
    
    closeBtn.addEventListener('click', () => {
      definitionPopup.remove();
      definitionPopup = null;
    });
  }
  
  // Auto-remove after 10 seconds if loading
  if (isLoading) {
    setTimeout(() => {
      if (definitionPopup) {
        definitionPopup.remove();
        definitionPopup = null;
      }
    }, 10000);
  }
}

function saveWordToDictionary(word, meaning) {
  chrome.storage.local.get({dictionary: []}, (res) => {
    // Check if word already exists
    const exists = res.dictionary.some(entry => entry.word.toLowerCase() === word.toLowerCase());
    if (exists) return;
    
    const updated = [...res.dictionary, {word, meaning, timestamp: new Date().toISOString()}];
    chrome.storage.local.set({dictionary: updated});
  });
}

// Close popup when clicking outside
document.addEventListener('click', (e) => {
  if (definitionPopup && !definitionPopup.contains(e.target)) {
    definitionPopup.remove();
    definitionPopup = null;
  }
});

// Close popup on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && definitionPopup) {
    definitionPopup.remove();
    definitionPopup = null;
  }
});
