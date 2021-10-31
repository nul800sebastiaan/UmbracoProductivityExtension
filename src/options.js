// Saves options to chrome.storage
function save_options() {
    var openBackofficeInNewTabValue = document.getElementById("backoffice-new-tab").checked;
    var hideLogos = document.getElementById("hide-logos").checked;

    chrome.storage.sync.set({
        openBackofficeInNewTab: openBackofficeInNewTabValue,
        hideLogos: hideLogos
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(function () {
            status.textContent = "";
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = "red" and likesColor = true.
    chrome.storage.sync.get({
        openBackofficeInNewTab: false,
        hideLogos: false,
    }, function (items) {
        document.getElementById("backoffice-new-tab").checked = items.openBackofficeInNewTab
        document.getElementById("hide-logos").checked = items.hideLogos;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);