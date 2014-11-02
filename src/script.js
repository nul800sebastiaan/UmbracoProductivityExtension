angular.module('umbracoDeveloper', ['ngMaterial']).controller('PopupController', function ($scope) {
    // Although I wanted to use Angular properly.. it's not supported in Chrome extensions.. boo!
});

document.addEventListener('DOMContentLoaded', popup, false);

function popup() {
    document.getElementById('button-normal').addEventListener('click', handleClickNormal);
    document.getElementById('button-miniprofiler').addEventListener('click', handleClickMiniProfiler);
    document.getElementById('button-umbraco').addEventListener('click', handleClickUmbraco);
    document.getElementById('button-trace').addEventListener('click', handleClickTrace);
    document.getElementById('button-debug-trace').addEventListener('click', handleClickDebugShowTrace);

    var openBackofficeInNewTab;
    var showDebugShowTrace;

    chrome.storage.sync.get({
        openBackofficeInNewTab: false,
        showDebugShowTrace: false
    }, function (items) {
        openBackofficeInNewTab = items.openBackofficeInNewTab;
        showDebugShowTrace = items.showDebugShowTrace;

        if (showDebugShowTrace) {
            document.getElementById('button-debug-trace').style.display = 'block';
        }
    });

    function handleClickNormal() {
        chrome.tabs.getSelected(null, function (tab) {
            var arr = tab.url.split('/');
            var newUrl = arr[0] + '//' + arr[2];
            chrome.tabs.update(tab.id, { url: newUrl });
            hidePopup();
        });
    };

    function handleClickUmbraco() {
        chrome.tabs.getSelected(null, function (tab) {
            var arr = tab.url.split('/');
            var newUrl = arr[0] + '//' + arr[2] + '/umbraco/';
            if (openBackofficeInNewTab) {
                chrome.tabs.create({ url: newUrl });
            } else {
                chrome.tabs.update(tab.id, { url: newUrl });
            }
            hidePopup();
        });
    };
    
    var miniprofilerQuerystringParameter = 'umbDebug';
    var debugShowTraceQuerystringParameter = 'umbDebugShowTrace';

    function handleClickMiniProfiler() {
        chrome.tabs.getSelected(null, function (tab) {
            var newUrl = removeKnownUmbracoQuerystrings(tab.url);
            newUrl = updateQueryStringParameter(newUrl, miniprofilerQuerystringParameter, 'true')
            chrome.tabs.update(tab.id, { url: newUrl });
            hidePopup();
        });
    };

    function handleClickDebugShowTrace() {
        chrome.tabs.getSelected(null, function (tab) {
            var newUrl = removeKnownUmbracoQuerystrings(tab.url);
            newUrl = updateQueryStringParameter(newUrl, debugShowTraceQuerystringParameter, 'true')
            chrome.tabs.update(tab.id, { url: newUrl });
            hidePopup();
        });
    };

    function handleClickTrace() {
        chrome.tabs.getSelected(null, function (tab) {
            var arr = tab.url.split('/');
            var newUrl = arr[0] + '//' + arr[2] + '/trace.axd';
            chrome.tabs.update(tab.id, { url: newUrl });
            hidePopup();
        });
    };

    function hidePopup() {
        setTimeout(function () {
            window.close();
        }, 300);
    }

    function removeKnownUmbracoQuerystrings(url) {
        var newUrl = url;
        newUrl = removeQueryStringParameter(newUrl, miniprofilerQuerystringParameter);
        newUrl = removeQueryStringParameter(newUrl, debugShowTraceQuerystringParameter);

        return newUrl;
    }

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp('([?|&])' + key + '=.*?(&|#|$)', 'i');
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            var hash = '';
            var separator = uri.indexOf('?') !== -1 ? '&' : '?';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            return uri + separator + key + '=' + value + hash;
        }
    }

    function removeQueryStringParameter(url, parameter) {
        //prefer to use l.search if you have a location/link object
        var urlparts = url.split('?');
        if (urlparts.length >= 2) {

            var prefix = encodeURIComponent(parameter) + '=';
            var pars = urlparts[1].split(/[&;]/g);

            //reverse iteration as may be destructive
            for (var i = pars.length; i-- > 0;) {
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }

            if (pars.length === 0) {
                url = urlparts[0];
            } else {
                url = urlparts[0] + '?';
            }

            url = url + pars.join('&');
            return url;
        } else {
            return url;
        }
    }
}