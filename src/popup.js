"use strict";

var openBackofficeInNewTab;
var openFrontendInNewTab;
var backofficeSlug = "umbraco";

// set config options based on stored config
chrome.storage.sync.get({
    openFrontendInNewTab: false,
    openBackofficeInNewTab: false,
    hideLogos: false,
    showMiniProfiler: false
}, function (items) {
    openBackofficeInNewTab = items.openBackofficeInNewTab;
    openFrontendInNewTab = items.openFrontendInNewTab;

    if (!items.hideLogos) {
        document.getElementById("logos").style.display = "flex";
    }

    if (!items.showMiniProfiler) {
        document.getElementById("miniprofiler").style.display = "none";
    }
});

// find all buttons and add a click event listener
document.addEventListener("DOMContentLoaded", function () {
    var divs = document.querySelectorAll("button");
    for (var i = 0; i < divs.length; i++) {
        divs[i].addEventListener("click", click);
    }
});

// when a button is clicked, this event listener will respond
function click(e) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        let tabId = tabs[0].id;

        var arr = url.split("/");
        // [0] will contain "http" or "https"
        // [1] will contain an empty string, there is nothing between the first and second "/"
        // [2] will contain the domain name like "umbraco.com"
        var newUrl = arr[0] + "//" + arr[2];
        var firstSlug = arr[3];

        switch (e.target.id) {
            case "backoffice":
                // when clicking the backoffice button, append /umbraco to the clean URL
                newUrl = newUrl + "/" + backofficeSlug;
                openUrl(newUrl, tabId, firstSlug);
                break;
            case "miniprofiler":
                // when clicking the miniprofiler button add the ?umbDebug=true querystring to the current URL
                newUrl = UpdateQueryString("umbDebug", "true", newUrl);
                openUrl(newUrl, tabId, firstSlug);
                break;
            default:
                openUrl(newUrl, tabId, firstSlug);
        }
    });
}

function openUrl(newUrl, tabId, firstSlug) {
    var inBackoffice = false;
    var inFrontend = false;
    var openLinkInNewTab = false;

    if (firstSlug && firstSlug.startsWith(backofficeSlug)) {
        inBackoffice = true;
    } else {
        inFrontend = true;
    }

    var arr = newUrl.split("/");
    var destinationFirstSlug = arr[3];
    var destinationIsBackoffice = false;
    var destinationIsFrontend = false;
    if (destinationFirstSlug && destinationFirstSlug.startsWith(backofficeSlug)) {
        destinationIsBackoffice = true;
    } else {
        destinationIsFrontend = true;
    }

    if (openFrontendInNewTab && inBackoffice) {
        if (destinationIsFrontend) {
            // we're going from backoffice to frontend, open in new tab
            openLinkInNewTab = true;
        }
    }

    if (openBackofficeInNewTab && inFrontend) {
        if (destinationIsBackoffice) {
            // we're going from frontend to backoffice, open in new tab
            openLinkInNewTab = true;
        }
    }

    if (openLinkInNewTab) {
        chrome.tabs.create({ url: newUrl });
    } else {
        chrome.tabs.update(tabId, { url: newUrl });
    }

    // hide popup
    setTimeout(function () {
        window.close();
    }, 300);
}

// adapted from: https://stackoverflow.com/a/21784228/5018
function UpdateQueryString(key, value, url) {
    var result = null;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi");

    if (re.test(url)) {
        if (typeof value !== "undefined" && value !== null) result = url.replace(re, "$1" + key + "=" + value + "$2$3");
        else {
            var hash = url.split("#");
            url = hash[0].replace(re, "$1$3").replace(/(&|\?)$/, "");
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
            result = url;
        }
    } else {
        if (typeof value !== "undefined" && value !== null) {
            var separator = url.indexOf("?") !== -1 ? "&" : "?",
                hash = url.split("#");
            url = hash[0] + separator + key + "=" + value;
            if (typeof hash[1] !== "undefined" && hash[1] !== null) url += "#" + hash[1];
            result = url;
        } else result = url;
    }

    return result;
}