'use strict';

// set config options based on stored config
var openBackofficeInNewTab;
var hideLogos;

chrome.storage.sync.get({
    openBackofficeInNewTab: false,
    hideLogos: false
}, function (items) {
    openBackofficeInNewTab = items.openBackofficeInNewTab;
    hideLogos = items.hideLogos;

    if (!hideLogos) {
        document.getElementById('logos').style.display = 'flex';
    }
});

// find all buttons and add a click event listener
document.addEventListener('DOMContentLoaded', function () {
    var divs = document.querySelectorAll('button');
    for (var i = 0; i < divs.length; i++) {
        divs[i].addEventListener('click', click);
    }
});

// when a button is clicked, this event listener will respond
function click(e) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        let tabId = tabs[0].id;

        var arr = url.split('/');
        var newUrl = arr[0] + '//' + arr[2];

        if (e.target.id === "backoffice") {
            newUrl = newUrl + "/umbraco";
            openUrl(newUrl, tabId, openBackofficeInNewTab);
        } else {
            openUrl(newUrl, tabId, false);
        }
    });
}

function openUrl(newUrl, tabId, newTab) {
    if (newTab) {
        chrome.tabs.create({ url: newUrl });
    } else {
        chrome.tabs.update(tabId, { url: newUrl });
    }

    // hide popup
    setTimeout(function () {
        window.close();
    }, 300);
}
