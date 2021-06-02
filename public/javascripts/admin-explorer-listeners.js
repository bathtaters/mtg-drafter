
// Setup listeners
function initListeners() {
    // View listeners
    addListenerAllBrswrs(document.getElementById("showViewForm"),"click",toggleViewSettings);
    addListenerAllBrswrs(document.getElementById("showQueryForm"),"click",toggleViewQuery);
    addListenerAllBrswrs(document.getElementById("showBgdsWrapper"),"click",clickBgdsCheck);

    // Add Query Value
    var filterButtons = document.getElementsByClassName("filterButton");
    for (var i = 0, l = filterButtons.length; i < l; i++) {
        addListenerAllBrswrs(filterButtons[i],"click",clickAddQuery);
    }

    // Click checkbox
    var viewChecks = document.getElementsByClassName("explorerViewCheckbox");
    for (var i = 0, l = viewChecks.length; i < l; i++) {
        addListenerAllBrswrs(viewChecks[i],"click",clickViewCheck);
    }

    // Click headers
    var hdrCells = document.getElementsByTagName("th");
    for (var i = 0, l = hdrCells.length; i < l; i++) {
        addListenerAllBrswrs(hdrCells[i],"click",clickHdrCell);
    }

    // Setup stuff
    setupHiding();
}

function setupHiding() {
    // Hide these columns by default
    var toHide = [
        "name","faceName","types","side","bgdColor","monoColor","text","footer",
        "imgUrl","multiverseId","gathererImg","scryfallId","scryfallImg","scryfallImgBack",
        "otherFaceIds","variations","printings"
    ];
    if (toHide) { log("Hiding columns: " + toHide); }
    for (var i = 0, l = toHide.length; i < l; i++) {
        hideColumn(toHide[i]);
        document.getElementById(toHide[i] + "Hide").checked = false;
    }
    // sortColumn();
}


// Common Functions

function hideColumn(col, show=false) {
    var columnCells = document.getElementsByClassName(col+"Col");
    for (var i = 0, l = columnCells.length; i < l; i++) {
        if (show) {
            columnCells[i].classList.remove("hidden");
        } else {
            columnCells[i].classList.add("hidden");
        }
    }

    if (show) {
        document.getElementById(col+"FilterItem").classList.remove("hidden");
    } else {
        document.getElementById(col+"FilterItem").classList.add("hidden");
    }
    
    log((show ? "Unhid " : "Hid ") + columnCells.length + " cells from column: " + col);
}

function sortColumn(colIndex=0, ascending=true, sortType=null) {
    var defaultCol = 2; // printedName

    var tbl = document.getElementById("resultsTable");
    sortTable(tbl, colIndex || defaultCol, !ascending, sortType);

    log("Sorted by column #" + (colIndex || defaultCol) + " in " + (ascending ? "ascending" : "descending") + " order.");
}

function resetColumnClasses() {
    var hdrCells = document.getElementsByTagName("th");
    for (var i = 0, l = hdrCells.length; i < l; i++) {
        var cellCls = hdrCells[i].classList;
        if (cellCls.contains("sortAsc")) { cellCls.remove("sortAsc"); }
        else if (cellCls.contains("sortDesc")) { cellCls.remove("sortDesc"); }
    }
}

function removeQuery(key, index=0) {
    // No index removes entire key

    var queryBox = document.getElementById(key + "Query");

    // Remove single item
    if (index) {
        var value = document.getElementById(key + "Value" + index);
        var remover = document.getElementById(key + "Remove" + index);
        queryBox.removeChild(value);
        queryBox.removeChild(remover);
    }

    // Remove entire key
    if (!index || queryBox.childElementCount < 2) {
        document.getElementById("queryDisplay").removeChild(queryBox);
    }
}

function addQuery(key, value, logic) {
    // Create new value node (+ x to remove)
    var newValue = document.createElement("span");
    newValue.classList.add("queryVal", "query"+logic);
    newValue.appendChild(document.createTextNode(value));
    
    var newX = document.createElement("a");
    newX.classList.add("rmvKey");
    addListenerAllBrswrs(newX,"click",clickRemoveQuery);
    newX.appendChild(document.createTextNode("x"));
    
    // Check if key already exists
    var queryBox = document.getElementById(key+"Query");
    var newBox = !queryBox;
    if (newBox) {
        // Create new box
        queryBox = document.createElement("div");
        queryBox.classList.add("queryDisplayItem");
        queryBox.id = key + "Query";
        
        var queryTitle = document.createElement("span");
        queryTitle.classList.add("queryName");
        
        var queryName = document.getElementById(key+"FilterName").innerText;
        queryTitle.appendChild(document.createTextNode(queryName));
        
        queryBox.appendChild(queryTitle);
    }
    
    // Number & add new value
    var i = 1, valId = key + "Value";
    while (document.getElementById(valId+i)) { i++; }
    newValue.id = valId + i;
    newX.id = key + "Remove" + i;
    queryBox.appendChild(newValue);
    queryBox.appendChild(newX);
    
    // Add new box
    if (newBox) { document.getElementById("queryDisplay").appendChild(queryBox); }
}










// Table Handlers

function clickViewCheck(e) {
    var elem = this || e.target || e.srcElemnt;
    var key = elem.id.replace(/Wrapper$/,"");
    log("clicked: "+key);

    hideColumn(key.replace(/Hide$/,""), document.getElementById(key).checked);    
}

function clickBgdsCheck(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: showBgds");

    var tbl = document.getElementById("resultsTable");

    if (document.getElementById(elem.id.replace(/Wrapper$/,"")).checked) {
        tbl.classList.remove("hideBgds");
    } else {
        tbl.classList.add("hideBgds");
    }
}


// Header Handlers

function clickHdrCell(e) {
    var elem = this || e.target || e.srcElemnt;
    var key = elem.id.replace(/Hdr$/,"");
    log("clicked: "+key+".Sort");

    var hdrCls = elem.classList;
    if (hdrCls.contains("sortAsc")) {
        sortColumn(elem.cellIndex + 1, false, key);
        hdrCls.remove("sortAsc");
        hdrCls.add("sortDesc");
    } else {
        if (!hdrCls.contains("sortDesc")) { resetColumnClasses(); }
        sortColumn(elem.cellIndex + 1, true, key);
        hdrCls.remove("sortDesc");
        hdrCls.add("sortAsc");
    }
}

function toggleViewSettings(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: showViewForm");

    var viewForm = document.getElementById("viewForm");

    if (viewForm.classList.contains("hidden")) {
        viewForm.classList.remove("hidden");
    } else {
        viewForm.classList.add("hidden");
    }
    
}

function toggleViewQuery(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: showQueryForm");

    var queryForm = document.getElementById("queryContainer");

    if (queryForm.classList.contains("hidden")) {
        queryForm.classList.remove("hidden");
        elem.value = "Hide Search";
    } else {
        queryForm.classList.add("hidden");
        elem.value = "Show Search";
    }
    
}


// Search Handlers

function clickAddQuery(e) {
    var elem = this || e.target || e.srcElemnt;

    var logic = elem.value == "&" ? "And" : "Or";
    var key = elem.id.replace(logic === "Or" ? /Or$/ : /And$/, "");
    log("clicked: "+key+".add."+logic);

    // Check text value
    var valueBox = document.getElementById(key+"Filter");
    if (!valueBox) { return log("Invalid Key to add",key+" ("+logic+")"); }
    value = valueBox.value;
    if (!value) { return log("No Value for Key: "+key+" ("+logic+")"); }

    addQuery(key, value, logic);
    valueBox.value = "";
}

function clickRemoveQuery(e) {
    var elem = this || e.target || e.srcElemnt;
    var rmvKey = elem.id;
    log("clicked: "+rmvKey);

    // Check key/index value
    var key = rmvKey.replace(/Remove\d+$/, "");
    var index = rmvKey.replace(key+"Remove", "");
    if (!key || key == rmvKey) { return log("Invalid Key to remove",rmvKey); }
    if (index && index == rmvKey) { return log("Invalid Index to remove",rmvKey); }

    removeQuery(key, index);
}

addWindowListenerAllBrswrs("load", initListeners, false);