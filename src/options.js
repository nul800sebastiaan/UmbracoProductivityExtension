var openInNewTabCheckbox;
var hideLogosCheckbox;
var showMiniProfilerCheckbox;

// Saves options to chrome.storage
function save_options() {
    var openBackofficeInNewTabValue = openInNewTabCheckbox.checked;
    var hideLogosValue = hideLogosCheckbox.checked;
    var showMiniProfilerValue = showMiniProfilerCheckbox.checked;

    chrome.storage.sync.set({
        openBackofficeInNewTab: openBackofficeInNewTabValue,
        hideLogos: hideLogosValue,
        showMiniProfiler: showMiniProfilerValue
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
    openInNewTabCheckbox = document.getElementById("backoffice-new-tab")
    hideLogosCheckbox = document.getElementById("hide-logos");
    showMiniProfilerCheckbox = document.getElementById("show-mini-profiler");

    // Use default value color = "red" and likesColor = true.
    chrome.storage.sync.get({
        openBackofficeInNewTab: false,
        hideLogos: false,
        showMiniProfiler: false
    }, function (items) {
        openInNewTabCheckbox.checked = items.openBackofficeInNewTab
        hideLogosCheckbox.checked = items.hideLogos;
        showMiniProfilerCheckbox.checked = items.showMiniProfiler;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);