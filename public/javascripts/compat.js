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

// Get option elements by value/text
function getOptions(selectElement, optionValues) {
    var remaining = optionValues.filter(function(){return true;});
    var opts = selectElement.options, result = [];
    for (var opt, i = 0; opt = opts[i]; i++) {
        var index = remaining.indexOf(opt.value || opt.text);
        if (index != -1) {
            result.push(opt);
            remaining.splice(index,1);
            if (!remaining.length) { break; }
        }
    }
    return result;
}
function getOption(selectElement, optionValue) { return getOptions(selectElement, [optionValue])[0]; }

// Delete option elements by value/text
function removeOptions(selectElement, optionValues) {
    var opts = selectElement.options, removed = [];
    for (var opt, i = 0; opt = opts[i]; i++) {
        var index = optionValues.indexOf(opt.value || opt.text);
        if (index != -1) {
            removed.push(opt.value || opt.text);
            selectElement.remove(i);
            optionValues.splice(index,1);
            if (!optionValues.length) { break; }
        }
    }
    return removed;
}
function removeOption(selectElement, optionValue) { return removeOptions(selectElement, [optionValue])[0]; }

// Change dropdown selection
function selectOption(selectElement, selectValue) {
    var opts = selectElement.options;
    for (var opt, i = 0; opt = opts[i]; i++) {
        if (opt.value == selectValue) {
            selectElement.selectedIndex = i;
            return true;
        }
    }
    return false;
}

// Extract selected options
function getSelectedOptions(selectElement, getIndex = false) {
    var allOptions = selectElement.options;
    var result = [];
    var opt;
    for (var i=0, e=allOptions.length; i < e; i++) {
        opt = allOptions[i];
        if (opt.selected) {
            if (getIndex) { result.push(i); }
            else { result.push(opt.value || opt.text); }
        }
    }
    return result;
}

// Replace options in select menu
function setSelectOptions(selectElement, values, options = null) {
    var selected = getSelectedOptions(selectElement);
    // Remove all options
    for (var i=0, e=selectElement.options.length; i < e; i++ ) {
        selectElement.remove(0);
    }
    addSelectOptions(selectElement, values, options);
    return selectOption(selectElement, selected[0]);
}

// Add options to select menu
function addSelectOptions(selectElement, values, options = null) {
    for (var i = 0, e = values.length; i < e; i++){
        var newOpt = document.createElement("option");
        
        var text = values[i];
        if (options && typeof options === "function") {
            text = options(text);
        } else if (options && options.length >= values.length) {
            text = options[i];
        }

        newOpt.value = values[i];
        newOpt.innerHTML = text;
        selectElement.add(newOpt);
    }
}

// Move options in select menu (offset +/- = down/up)
function selectOptionMove(selectElement, offset) {
    var selIndex = getSelectedOptions(selectElement, true);
    if (!selIndex || !selIndex.length) {
      return log("Error moving option","No option selected to move.");
    }
    selIndex = selIndex[0];
    if ((selIndex + offset) < 0 ||
      (selIndex + offset) > (selectElement.options.length - 1)) {
      return;
    }

    var attribs = ["value","innerHTML","classList"], selAttrib;
    for (var i=0, e=attribs.length; i < e; i++) {
        selAttrib = selectElement.options[selIndex][attribs[i]];
        selectElement.options[selIndex][attribs[i]] = selectElement.options[selIndex + offset][attribs[i]];
        selectElement.options[selIndex + offset][attribs[i]] = selAttrib;
    }
    selectElement.selectedIndex = selIndex + offset;
  }

// Enable/Disable buttons (using IDs) based on if 'selectElem' is selected
function setButtonStatus(selectElem, buttonIds) {
    var disable = true; var opts = selectElem.options;
    if (opts === undefined) { disable = !selectElem; }
    else {
        for (var i=0, e=opts.length; i < e; i++) {
            if (opts[i].selected) { disable = false; break; }
        }
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

// Setup sort algorithms
mtgDrafterGlobals.sort = {
    colorKey: "WUBRG",
    rarityKey: ["mythic","rare","uncommon","common"],
    defaultAlgo: function(a, b){
        if (!isNaN(a) && !isNaN(b)) { return a - b; }
        return a < b ? -1 : (a > b ? 1 : 0);
    },
    colorAlgo: function(a,b){
        if (a.length == 1 && b.length == 1) {
            return mtgDrafterGlobals.sort.colorKey.indexOf(a)
                - mtgDrafterGlobals.sort.colorKey.indexOf(b);
        } else { return a.length - b.length; }
    },
    rarityAlgo: function(a, b) {
        return mtgDrafterGlobals.sort.rarityKey.indexOf(a)
            - mtgDrafterGlobals.sort.rarityKey.indexOf(b);
    }
}
// Sort a table based on column number
function sortTable(table, colIndex, reverse=false, sortAlgo=null, getText=function(e){return e.innerText;}) {

    // Pick sort algorithm
    if (typeof sortAlgo == "string") {
        if (sortAlgo.toLowerCase() == "colors") {
            sortAlgo = mtgDrafterGlobals.sort.colorAlgo;
        } else if (sortAlgo.toLowerCase() == "rarity") {
            sortAlgo = mtgDrafterGlobals.sort.rarityAlgo;
        } else { sortAlgo = null; }
    }
    if (!sortAlgo) { sortAlgo = mtgDrafterGlobals.sort.defaultAlgo; }

    // Get rows
    var body = table.getElementsByTagName("tbody");
    if (body && body.length) { table = body[0]; } // Get body
    let rows = Array.from(table.querySelectorAll("tbody > tr"));
    if (!body || !body.length) { rows = rows.slice(1); } // Ignore header
  
    // Column selector
    let qs = "td:nth-child(" + colIndex + ")";
    
    // Sort rows by column selector
    rows.sort( function(rowA,rowB) {
      let cellA = rowA.querySelector(qs);
      let cellB = rowB.querySelector(qs);
      return (reverse ? -1 : 1) * sortAlgo(getText(cellA), getText(cellB));
    });
  
    // Apply sort to page
    for (var i=0, e=rows.length; i < e; i++) {
        table.appendChild(rows[i]);
    }
}








// ------------------ FETCH ------------------------ //


// Fetch requests
function postData(action, data = null, url = '../action', content = 'application/json') {
    log((data ? 'Post' : 'Get')+'Data: '+url+'/'+action);
    return fetch(url + '/' + action, {
        method: data ? 'POST' : 'GET',
        //cache: 'no-cache', // Forces to not use cache
        credentials: 'same-origin',
        headers: { 'Content-Type': content },
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

function updateServer(action, data = null, url = '../action', html = false) {
    return postData(action,data,url, html ? 'text/html' : 'application/json')
        .then( function(res){ return res ? (html ? res.text() :  res.json()) : res; })
        .then( function(res){
            if (!res || res.error) {
                log('Fetch error',res ? res.error : 'No response from server: '+JSON.stringify(res));
                // delete res.error;
            }
            log('Response: '+JSON.stringify(res));
            return res;
        })
        .catch( error => log('Fetch error',error) );
}

function updateMultiple(urlIds, urlPrefix, action, data) {
    var updates = [];
    for (var i=0, e=urlIds.length; i < e; i++) {
        var urlSuffix = urlIds[i].value || urlIds[i] || "null";
        updates.push(updateServer(action,data,urlPrefix+urlSuffix));
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


// ------ Client Version of Shared Functions ----- //

// Space/Capitalize variable names
function varName(varName) {
    var res = '';
    for (var i = 0, l = varName.length; i < l; i++) {
        if (!i) { res += varName[i].toUpperCase(); }
        else if (varName[i].toLowerCase() !== varName[i]) {
            res += ' ' + varName[i];
        } else { res += varName[i]; }
    }
    return res;
}

// Replace Brace code (used in db) w/ CSS styles (For mana.css)
function mtgSymbolReplace(text, shadow=false) {
    var specials = {
        'T': 'tap'
    };
    var tagBuild = [
        '<i class="ms ms-cost' + (shadow ? ' ms-shadow' : '') + ' ms-',
        '"></i>'
    ];
    var braceRegex = /\{(.{1,3})\}/g;

    function replaceWith(m, p1, o, s) {
        var val = String(p1);
        if (val in specials) { val = specials[val]; }
        val = val.replace(/\//g,'');
        val = val.toLowerCase();
        val = tagBuild[0] + val + tagBuild[1];
        return val;
    }

    return text ? text.replaceAll(braceRegex, replaceWith) : '';
}

// Inverse of SymbolReplace
function mtgSymbolRevert(text) {
    var invSpecials = {
        'tap': 'T'
    };
    var braceBuild = ['{','}'];
    var tagRegex = /<i class="ms ms-cost(?: ms-shadow)? ms-(.{1,3})"><\/i>/g;

    function replaceWithInv(m, p1, o, s) {
        let val = String(p1);
        if (val in invSpecials) val = invSpecials[val];
        val = val.toUpperCase();
        if (val.length == 2 && isNaN(val)) val = val.charAt(0) + '/' + val.charAt(1);
        val = braceBuild[0] + val + braceBuild[1];
        //console.log('replaced: '+m+' with '+val);
        return val;
    }

    return text ? text.replaceAll(tagRegex, replaceWithInv) : '';
}