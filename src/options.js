var openBackofficeInNewTabCheckbox;
var openFrontendInNewTabCheckbox;
var hideLogosCheckbox;
var showMiniProfilerCheckbox;

// Saves options to chrome.storage
function save_options() {
    var openBackofficeInNewTabValue = openBackofficeInNewTabCheckbox.checked;
    var openFrontendInNewTabValue = openFrontendInNewTabCheckbox.checked;
    var hideLogosValue = hideLogosCheckbox.checked;
    var showMiniProfilerValue = showMiniProfilerCheckbox.checked;

    chrome.storage.sync.set({
        openBackofficeInNewTab: openBackofficeInNewTabValue,
        openFrontendInNewTab: openFrontendInNewTabValue,
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
    openBackofficeInNewTabCheckbox = document.getElementById("backoffice-new-tab")
    openFrontendInNewTabCheckbox = document.getElementById("frontend-new-tab")
    hideLogosCheckbox = document.getElementById("hide-logos");
    showMiniProfilerCheckbox = document.getElementById("show-mini-profiler");

    // Use default value color = "red" and likesColor = true.
    chrome.storage.sync.get({
        openBackofficeInNewTab: false,
        openFrontendInNewTab: false,
        hideLogos: false,
        showMiniProfiler: false
    }, function (items) {
        openBackofficeInNewTabCheckbox.checked = items.openBackofficeInNewTab;
        openFrontendInNewTabCheckbox.checked = items.openFrontendInNewTab;
        hideLogosCheckbox.checked = items.hideLogos;
        showMiniProfilerCheckbox.checked = items.showMiniProfiler;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);