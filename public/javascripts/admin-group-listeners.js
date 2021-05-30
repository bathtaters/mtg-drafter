// Setup listeners
function initListeners() {
    // View listeners
    addListenerAllBrswrs(document.getElementById("showViewForm"),"click",toggleViewSettings);
    addListenerAllBrswrs(document.getElementById("showBgdsWrapper"),"click",clickBgdsCheck);

    // Click checkbox
    var viewChecks = document.getElementsByClassName("grpViewCheckbox");
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

function hideColumn(col, show=false) {
    var columnCells = document.getElementsByClassName(col+"Col");
    for (var i = 0, l = columnCells.length; i < l; i++) {
        if (show) {
            columnCells[i].classList.remove("hidden");
        } else {
            columnCells[i].classList.add("hidden");
        }
    }
    log((show ? "Unhid " : "Hid ") + columnCells.length + " cells from column: " + col);
}

function sortColumn(colIndex=0, ascending=true, sortType=null) {
    var defaultCol = 2; // printedName

    var tbl = document.getElementById("grpTable");
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

function clickViewCheck(e) {
    var elem = this || e.target || e.srcElemnt;
    var key = elem.id.replace(/Wrapper$/,"");
    log("clicked: "+key);

    hideColumn(key.replace(/Hide$/,""), document.getElementById(key).checked);    
}

function clickBgdsCheck(e) {
    var elem = this || e.target || e.srcElemnt;
    log("clicked: showBgds");

    var tbl = document.getElementById("grpTable");

    if (document.getElementById(elem.id.replace(/Wrapper$/,"")).checked) {
        tbl.classList.remove("hideBgds");
    } else {
        tbl.classList.add("hideBgds");
    }
}

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

addWindowListenerAllBrswrs("load", initListeners, false);