// cubeType boosterType

function initListeners() {
    // Select draft type listeners
    addListenerAllBrswrs(document.getElementById("cubeType"),"click",clickType);
    addListenerAllBrswrs(document.getElementById("boosterType"),"click",clickType);
    // Add booster pack list
    addListenerAllBrswrs(document.getElementById("addBooster"),"click",addBosterList)
    addListenerAllBrswrs(document.getElementById("removeBooster"),"click",removeBosterList)
    // Pre-add 2
    for (var i=0; i<2; i++) { addBosterList(0); }
}
function clickType(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    console.log("single clicked: "+elem.id);

    // get all elements (Set as default type "booster")
    var saveType  =  document.getElementById("draftType");
    var hideForm  =  document.getElementById("cubeForm");
    var showForm  =  document.getElementById("boosterForm");
    var upButton  =  document.getElementById("cubeType");
    var downButton = document.getElementById("boosterType");
    
    // Flip if "cube" was chosen
    if (elem.id == "cubeType") {
        var temp = hideForm;
        hideForm = showForm;
        showForm = temp;
        temp = upButton;
        upButton = downButton;
        downButton = temp;
    } else if (elem.id != "boosterType") {
        return;
    }

    saveType.value = elem.id;
    if (saveType.value == "boosterType") {
        document.getElementById("setupTitle").removeAttribute("disabled");
    } else {
        document.getElementById("setupTitle").setAttribute("disabled", true);
    }

    // Set new values
    
    hideForm.classList.add("hideForm");
    showForm.classList.remove("hideForm");
    upButton.classList.remove("pressed");
    downButton.classList.add("pressed");
}
function addBosterList(e) {
    e && e.preventDefault();
    console.log('add boster pack')
    // Get list to clone (If less than 2 (base elements) + 10 (max boosters) - 1)
    var setList = document.getElementById("setPicker").cloneNode(true);
    if (document.getElementById("boosterForm").childNodes.length < 2 + 10 - 1) {
        document.getElementById("boosterForm").appendChild(setList);
    }
}
function removeBosterList(e) {
    e && e.preventDefault();
    console.log('remove boster pack')
    // Get all lists
    var pickers = document.getElementById("boosterForm").childNodes;
    console.log(pickers.length);
    if (pickers.length > 2) { // 2 == base elements
        document.getElementById("boosterForm").removeChild(pickers[pickers.length - 1]);
    }
}
addWindowListenerAllBrswrs("load", initListeners, false);