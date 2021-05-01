// Logging settings
var mtgDrafterGlobals = { logging: false };
function log(msg, err=false) {
    if (err) { console.error(msg,err); }
    else if (mtgDrafterGlobals.logging) { console.debug(msg); }
}

// Add listeners
function addListenerAllBrswrs(elem, listener, func, useCapture=false) {
    if (elem.addEventListener) {
        elem.addEventListener(listener,func,useCapture);
    } else if(elem.attachEvent) {
        elem.attachEvent("on"+listener,func);
    }
    //log('added '+listener+' listener to '+(elem.id||elem.tagName||'no-id'));
}
function addWindowListenerAllBrswrs(listener, func, useCapture=false) {
    if (window.addEventListener) {
        window.addEventListener(listener, func, useCapture);
    } else if (window.attachEvent) {
        if (listener.substring(0,2).toLowerCase() != "on") {
            listener = "on" + listener;
        }
        window.attachEvent(listener, func);
    } else {
       document.addEventListener(listener, func, useCapture);
    }
    //log('added '+listener+' listener to window');
}

// Stop click fallthrough
function stopPropagationAllBrswrs(event) {
    if (!event) event = window.event;
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
}
function preventDefaults(event) {
    event.preventDefault()
    stopPropagationAllBrswrs(event)
}

// Copy Text
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        log('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        log('"'+text+'" copied to clipboard.');
    }, function(err) {
        log('Could not copy text: '+text, err);
    });
}

// Extract selected options
function getSelectedOptions(selectElement) {
    var allOptions = selectElement.options;
    var result = [];
    var opt;
    for (var i=0, e=allOptions.length; i < e; i++) {
        opt = allOptions[i];
        if (opt.selected) { result.push(opt.value || opt.text); }
    }
    return result;
}

// Enable/Disable buttons (using IDs) based on if 'selectElem' is selected
function setButtonStatus(selectElem, buttonIds) {
    var disable = true; var opts = selectElem.options;
    for (var i=0, e=opts.length; i < e; i++) {
        if (opts[i].selected) { disable = false; break;}
    }

    var firstButton = document.getElementById(buttonIds[0]);
    if (disable != firstButton.hasAttribute("disabled")) {

        if (disable) {
            firstButton.setAttribute("disabled","true");
            for (var i=1, e=buttonIds.length; i < e; i++) {
                document.getElementById(buttonIds[i]).setAttribute("disabled","true");
            }
            log("disabled "+selectElem.id+" buttons");

        } else {
            firstButton.removeAttribute("disabled");
            for (var i=1, e=buttonIds.length; i < e; i++) {
                document.getElementById(buttonIds[i]).removeAttribute("disabled");
            }
            log("enabled "+selectElem.id+" buttons");
        }
    }
}


// Fetch requests
function postData(action, data = null, url = '../action') {
    log('PostData: '+url+'/'+action);
    return fetch(url + '/' + action, {
        method: data ? 'POST' : 'GET',
        //cache: 'no-cache', // Forces to not use cache
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
    }).then( function(response){
        if (response.ok) { return response; }
        else {
            log('Fetch request failed: '+url+'/'+action+' '+JSON.stringify(data), 'FETCH API ERR');
        }
        return;
    }); 
}

function postFormData(action, formData, url = '../action') {
    var jsonFormData = Object.fromEntries(formData.entries());
    return updateServer(action, jsonFormData, url);
}

function updateServer(action, data = null, url = '../action') {
    return postData(action,data,url)
        .then( function(res){return res.json();})
        .then( function(res){
            if (res.error) {
                log('Fetch error',res.error);
                delete res.error;
            }
            return res;
        })
        .catch( error => log('Fetch error',error) );
}

function updateMultiple(urlIds, urlPrefix, action, data) {
    var updates = [];
    for (var i=0, e=urlIds.length; i < e; i++) {
        var urlSuffix = urlIds[i].value || urlIds[i] || "null";
        updates.push(updateServer(action,data,urlPrefix+urlSuffix)
            .then( function(result) {
                log("Completed "+action+": "+JSON.stringify(result));
            }));
    }
    return Promise.all(updates);
}

function poll(action, interval=2000) {
    function executePoll(resolve, reject) {
      return updateServer(action).then( function(result){
        if (result.refresh) {
            return resolve(result);
        } else {
            setTimeout(executePoll, interval, resolve, reject);
        }
      });
    }
    return new Promise(executePoll);
}

function uploadFile(fileForm, url='./action/upload') {
    return fetch(url, {
        method: 'POST',
        body: fileForm
    }).then( response => response.json() )
    .catch( error => log('Upload error',error) );
}

function downloadFile(data = null, contentType = 'text/plain', url = '../action') {

    function filenameFromHeader(header) {
        var contentDispostion = header.split(';');
        var cdLen = contentDispostion.length;
        
        // Find extended filename
        var fileNameToken = `filename*=UTF-8''`;
        for (var i=0; i<cdLen; i++) {
            if (contentDispostion[i].trim().indexOf(fileNameToken) === 0) {
                return decodeURIComponent(contentDispostion[i].trim().replace(fileNameToken, ''));
            }
        }

        // Find simple filename
        fileNameToken = 'filename=';
        for (var i=0; i<cdLen; i++) {
            if (contentDispostion[i].trim().indexOf(fileNameToken) === 0) {
                return contentDispostion[i].trim().replace(fileNameToken, '').replace(/"/g,'');
            }
        }

        // Use default name
        return 'DraftDeck_'+(new Date().toISOString())+'.txt';
    }

    log('Retrieving deck file.')
    return postData('download',data,url)
        .then( function(res){ 
            return Promise.all([
                res.blob(),
                Promise.resolve(filenameFromHeader(res.headers.get('content-disposition')))
            ]);
        }).then( function(data){
            // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
            var newBlob = new Blob([data[0]], { type: contentType });

            // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob,data[1]);
            } else {
                // For other browsers: create a link pointing to the ObjectURL containing the blob.
                var objUrl = window.URL.createObjectURL(newBlob);

                var link = document.createElement('a');
                link.href = objUrl;
                link.download = data[1];
                link.click();

                // For Firefox it is necessary to delay revoking the ObjectURL.
                setTimeout(() => { window.URL.revokeObjectURL(objUrl); }, 250);
            }
        });
  }