// Setup listeners
function initListeners() {
    // Setup stuff
    setupHiding();
    
    // Edit listeners
    addListenerAllBrswrs(document.getElementById("editCard"),"click",clickEditCard);

    // Click option links
    var optionLinks = document.getElementsByClassName("detailOption");
    for (var i = 0, l = optionLinks.length; i < l; i++) {
        addListenerAllBrswrs(optionLinks[i],"click",clickOptionLink);
    }

    // Start w/ empty values hidden
    document.getElementById("hideEmpty").click();
}

// Add "emptyKey" class to all keys w/ empty values
function setupHiding() {
    var empty = document.getElementsByClassName("empty");
    for (var i = 0, l = empty.length; i < l; i++) {
        addListenerAllBrswrs(empty[i],"click",clickEmpty);
        var emptyKey = empty[i].previousSibling;
        emptyKey.classList.add("emptyKey");
    }
}

// Click on an option link
function clickOptionLink(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("clicked option: "+elem.id);

    // Show/hide image
    if (elem.id == "hideImage") {
        var images = document.getElementsByClassName("cardImage");
        if (elem.innerText == "Hide Image") {
            for (var i = 0, l = images.length; i < l; i++) {
                images[i].classList.add("hidden");
            }
            elem.innerText = "Show Image"
        } else {
            for (var i = 0, l = images.length; i < l; i++) {
                images[i].classList.remove("hidden");
            }
            elem.innerText = "Hide Image"
        }

    // Show/hide empty values
    } else if (elem.id == "hideEmpty") {

        var emptyKeys = document.getElementsByClassName("emptyKey");
        var emptyVals = document.getElementsByClassName("empty");
        var l = emptyKeys.length;
        if (emptyVals.length < l) l = emptyVals.length;

        if (elem.innerText == "Hide Empty") {
            for (var i = 0; i < l; i++) {
                emptyKeys[i].classList.add("hidden");
                emptyVals[i].classList.add("hidden");
            }
            elem.innerText = "Show Empty"
        } else {
            for (var i = 0; i < l; i++) {
                emptyKeys[i].classList.remove("hidden");
                emptyVals[i].classList.remove("hidden");
            }
            elem.innerText = "Hide Empty"
        }


    }
}

function clickRemove(e) {
    var elem = this || e.target || e.srcElemnt;
    var key = elem.id;
    log("clicked: remove."+key);
    if (confirm("Are you sure you want to delete the fix for \""+key+"\"? It will not be recoverable.")) {
        updateServer("clear",{key:key},"db").then( function(result) {
            log("Deleted key fix: "+(result && result.cleared ? result.key : "none"));
            location.reload();
        });
    }
}

// Click edit card button
function clickEditCard(e) {
    var elem = this || e.target || e.srcElemnt;
    var button = elem.value;
    log("clicked: editCard");

    var editable = document.getElementsByClassName("unlocked");

    if (button === "Edit") {
        elem.value = " ... ";

        // Show hidden
        var emptyHider = document.getElementById("hideEmpty");
        if (emptyHider.innerText == "Show Empty") { emptyHider.click(); }
        
        // Allow editing
        for (var i = 0, l = editable.length; i < l; i++) {
            editable[i].innerHTML = mtgSymbolRevert(editable[i].innerHTML);
            editable[i].setAttribute("contenteditable",true);
        }

        // Hide asterisks
        var starred = document.getElementsByClassName("hasFix");
        for (var i = starred.length - 1; i >= 0; i--) {
            starred[i].classList.remove("hasFix");
        }

        // Show delete buttons
        var removable = document.getElementsByClassName("rmvFix");
        for (var i = 0, l = removable.length; i < l; i++) {
            addListenerAllBrswrs(removable[i],"click",clickRemove);
            removable[i].classList.remove("hidden");
        }

        elem.value = "Save";

    } else if (button === "Save") {
        let editSet = {};
        elem.value = " ... ";

        // Save all values
        for (var i = 0, l = editable.length; i < l; i++) {
            editable[i].removeAttribute("contenteditable");
            
            // Empty
            if (!editable[i].innerText || editable[i].innerText === "Empty") { continue; }

            // Arrays
            if (editable[i].classList.contains("arrayWrapper")) {
                var arr = [];
                
                var leftover = editable[i].innerText;
                for (var j = 0, k = editable[i].children.length; j < k; j++) {
                    var entry = editable[i].children[j].innerHTML;
                    if (entry) arr.push(entry);
                    leftover = leftover.replace(entry,"");
                }
                if (leftover) arr.push(leftover);
                editSet[editable[i].id] = arr;
            }

            // Numbers
            else if (editable[i].classList.contains("number")) {
                editSet[editable[i].id] = +editable[i].innerText;
            }

            // Dates
            else if (editable[i].classList.contains("date")) {
                editSet[editable[i].id] = new Date(editable[i].innerText);
            }

            // Strings
            else {
                editSet[editable[i].id] = editable[i].innerText;
            }
            editable[i].innerHTML = mtgSymbolReplace(editable[i].innerHTML);
            
        }
        
        updateServer("set",{editSet:editSet},"db").then( function(result) {
            elem.value = "Edit";
            log("Updated keys: "+(result ? result.setKeys : "None"));
            location.reload();
        });
    }
    
}


// Click on "empty"
function clickEmpty(e) {
    var elem = this || e.target || e.srcElemnt;
    if (!elem.hasAttribute("contenteditable") || elem.innerText != "Empty") return;
    
    log("clicked: emptyBox " + (elem.id || "N/A"));

    elem.innerText = "";
    elem.classList.remove("empty");
    elem.previousSibling.classList.remove("emptyKey");
}


addWindowListenerAllBrswrs("load", initListeners, false);