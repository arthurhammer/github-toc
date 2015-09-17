function save() {
    var backlinks = document.getElementById("backlinks").checked;

    chrome.storage.sync.set({ backlinks: backlinks }, function() {
        var status = document.getElementById("status");
        status.textContent = "Changes take effect after reloading the affected GitHub pages.";
  });
}

function restore() {
    chrome.storage.sync.get({ backlinks: true }, function(items) {
        document.getElementById("backlinks").checked = items.backlinks;
    });
}

document.addEventListener("DOMContentLoaded", restore);
document.getElementById("backlinks").addEventListener("click", save);
