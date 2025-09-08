# Word Stash — Privacy Policy

Effective date: 2025-09-08

Thank you for using Word Stash. Your privacy is important to us. This policy explains what data the extension collects, how it is used, and the choices you have.

## Overview
Word Stash helps you save words from webpages into a personal dictionary you can view, edit, export, or clear.

## Data We Collect
- Words you select and save, and their meanings
- Timestamps of when entries are saved

We do not collect personal or sensitive user data.

## How We Use Data
- To store and display your saved dictionary entries
- To fetch word definitions when you save a word (see Third-Party Services)

## Where Data Is Stored
- Your saved words and meanings are stored locally on your device using `chrome.storage.local`.
- We do not transmit your saved dictionary to our servers; Word Stash does not operate any backend servers.

## Third-Party Services
- When you save a word, the extension may request definitions from `https://api.dictionaryapi.dev` to populate meanings.
- Only the selected word is sent to this service for the purpose of retrieving a definition.
- No identifiers or additional personal data are sent.

## Remote Code
- The extension does not execute remotely hosted code. All code is packaged with the extension.

## Permissions and Why We Use Them
- `activeTab`: Read the current text selection on the active page only when you trigger the context menu or shortcut, so the selected word can be saved.
- `contextMenus`: Add a “Save to Word Stash” option on text selection for explicit user-initiated saving.
- `scripting`: Inject a minimal function to read `window.getSelection()` on user action (e.g., keyboard shortcut). No persistent injection.
- `storage`: Save your dictionary entries locally on your device.

## Data Sharing and Selling
- We do not sell, rent, or share your data with third parties.
- Data is used solely to provide the extension’s functionality.

## User Control and Data Retention
- You can view, edit, export (to JSON), or clear all saved entries anytime via the extension UI.
- Data remains on your device until you clear it or uninstall the extension.

## Security
- Data is stored using Chrome’s extension storage. While we take reasonable measures within the extension’s scope, no method of electronic storage is perfectly secure.

## Children’s Privacy
- Word Stash is not directed to children under 13 and does not knowingly collect personal information from children.

## Changes to This Policy
- We may update this policy to reflect improvements or legal requirements. Material changes will be reflected by updating the Effective date above.

## Contact
If you have questions about this policy, contact us at: <mail@kaisersakhi.com>

---

Chrome Web Store disclosures summary:
- Data collected: user-selected words, meanings, timestamps (local only)
- Data sharing: none
- Data usage: feature functionality only
- Remote code: none
- Third-party requests: dictionary lookups to `api.dictionaryapi.dev`
