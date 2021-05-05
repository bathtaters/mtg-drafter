// Setup listeners
function initListeners() {
    // Setup stuff
    setupHiding();
    
    // Click option links
    var optionLinks = document.getElementsByClassName("detailOption");
    for (var i = 0, l = optionLinks.length; i < l; i++) {
        addListenerAllBrswrs(optionLinks[i],"click",clickOptionLink);
    }
}

// Add 'emptyKey' class to all keys w/ empty values
function setupHiding() {
    var empty = document.getElementsByClassName("empty");
    for (var i = 0, l = empty.length; i < l; i++) {
        var emptyKey = empty[i].previousSibling;
        emptyKey.classList.add("emptyKey");
        emptyKey.classList.add("hidden");
    }
}

// Click on an option link
function clickOptionLink(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("clicked option: "+elem.id);

    // Show/hide image
    if (elem.id == 'hideImage') {
        var images = document.getElementsByClassName("cardImage");
        if (elem.innerText == 'Hide Image') {
            for (var i = 0, l = images.length; i < l; i++) {
                images[i].classList.add("hidden");
            }
            elem.innerText = 'Show Image'
        } else {
            for (var i = 0, l = images.length; i < l; i++) {
                images[i].classList.remove("hidden");
            }
            elem.innerText = 'Hide Image'
        }

    // Show/hide empty values
    } else if (elem.id == 'hideEmpty') {

        var emptyKeys = document.getElementsByClassName("emptyKey");
        var emptyVals = document.getElementsByClassName("empty");
        var l = emptyKeys.length;
        if (emptyVals.length < l) l = emptyVals.length;

        if (elem.innerText == 'Hide Empty') {
            for (var i = 0; i < l; i++) {
                emptyKeys[i].classList.add("hidden");
                emptyVals[i].classList.add("hidden");
            }
            elem.innerText = 'Show Empty'
        } else {
            for (var i = 0; i < l; i++) {
                emptyKeys[i].classList.remove("hidden");
                emptyVals[i].classList.remove("hidden");
            }
            elem.innerText = 'Hide Empty'
        }


    }
}

addWindowListenerAllBrswrs("load", initListeners, false);