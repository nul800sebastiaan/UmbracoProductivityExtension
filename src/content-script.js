chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "checkForError") {
            var html = document.getElementsByTagName("html");
            if (html.length > 0) {
                var text = document.getElementsByTagName("html")[0].innerHTML

                // test for asp.net classic YSOD, regex from: 
                // https://www.codeproject.com/Tips/72247/Testing-and-Parsing-an-ASP-NET-YSOD-Yellow-Screen
                var rxYSOD = /<!--\s*\[(.*?)]:(\s*.*\s(.*[\n\r]*)*?)\s*(at(.*[\n\r]*)*)-->/;
                if (rxYSOD.test(text)) {
                    // looks like one..
                    var ysod = rxYSOD.exec(text);
                    errObj = { Message: ysod[2], StackTrace: ysod[4], ExceptionType: ysod[1] };
                    sendResponse({ ysod: errObj });
                    return;
                }

                // test for modern dotnet core error
                var titleElementQuery = document.getElementsByTagName("title");
                if (titleElementQuery.length !== 0 && titleElementQuery[0].innerText === "Internal Server Error") {
                    var stackTrace = "";
                    var message = "";

                    var stackTraceElem = document.querySelector("#exceptionDetail1 .rawExceptionStackTrace");
                    if (stackTraceElem !== null) {
                        stackTrace = stackTraceElem.innerText;
                    }

                    var messageElem = document.querySelector("#stackpage .stackerror");
                    if (messageElem !== null) {
                        message = messageElem.innerText;
                    }

                    errObj = { Message: message, StackTrace: stackTrace, ExceptionType: "" };
                    sendResponse({ ysod: errObj });
                    return;
                }
            }

            // no error found, send null response
            sendResponse({ ysod: null });
        }
    });