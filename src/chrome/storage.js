function getPreferences(defaults, callback) {
    chrome.storage.sync.get(defaults, callback);
}
