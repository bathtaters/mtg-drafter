// Setup listeners
function initListeners() {
    // Select draft type listeners
    addListenerAllBrswrs(document.getElementById("cubeType"),"click",clickType);
    addListenerAllBrswrs(document.getElementById("boosterType"),"click",clickType);
    // Add booster pack list
    addListenerAllBrswrs(document.getElementById("addBooster"),"click",addBoosterList)
    addListenerAllBrswrs(document.getElementById("removeBooster"),"click",removeBoosterList)
    // Pre-add 2
    for (var i=0; i<2; i++) { addBoosterList(0); }
    // Listen for cube upload
    addListenerAllBrswrs(document.getElementById("cubeFilePicker"),"change", chooseUpload);

    // Setup drag & drop
    var dropArea = document.getElementById("cubeFileBox");
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach( function(eventName){
        addListenerAllBrswrs(dropArea, eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach( function(eventName){
        addListenerAllBrswrs(dropArea, eventName, function(e) { dropArea.classList.add("dragHighlight"); }, false);
    });
    ['dragleave', 'drop'].forEach( function(eventName){
        addListenerAllBrswrs(dropArea, eventName, function(e) { dropArea.classList.remove("dragHighlight"); }, false);
    });
    addListenerAllBrswrs(dropArea,'drop',dropUpload,false);
}


// Change draft type
function clickType(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("single clicked: "+elem.id);

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
    var bigButton = document.getElementById("setupTitle");
    if (elem.id && bigButton.getAttribute("disabled")) {
        bigButton.removeAttribute("disabled");
    }
    if (!saveType.value) {
        bigButton.setAttribute("disabled", true);
    }

    // Set new values
    
    hideForm.classList.add("hideForm");
    showForm.classList.remove("hideForm");
    upButton.classList.remove("pressed");
    downButton.classList.add("pressed");
}

// Booster pack drop-downs
function addBoosterList(e) {
    e && e.preventDefault();
    log("add booster pack");
    // Get list to clone (If less than 2 (base elements) + 10 (max boosters) - 1)
    var setList = document.getElementById("setPicker").cloneNode(true);
    if (document.getElementById("boosterForm").childNodes.length < 2 + 10 - 1) {
        document.getElementById("boosterForm").appendChild(setList);
    }
}
function removeBoosterList(e) {
    e && e.preventDefault();
    log("remove booster pack");
    // Get all lists
    var pickers = document.getElementById("boosterForm").childNodes;
    if (pickers.length > 2) { // 2 == base elements
        document.getElementById("boosterForm").removeChild(pickers[pickers.length - 1]);
    }
}

// HANDLERS
  

  
function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
}
  

// Upload cube list
function chooseUpload(e) {
    var elem = this || e.target || e.srcElemnt;
    var fileForm = new FormData();
    fileForm.append("cubeFile", elem.files[0]);
    uploadCube(fileForm);
}
function dropUpload(e) {
    // var elem = this || e.target || e.srcElemnt;
    var files = e.dataTransfer.files;

    console.log(Object.keys(files[0]));
    var fileForm = new FormData();
    fileForm.append("cubeFile", files[0]);

    uploadCube(fileForm);
}
function uploadCube(fileForm) {
    var dragDrop = document.getElementById("dragDropText");
    var loading = document.getElementById("uploadWaiting");
    var readout = document.getElementById("uploadResultContainer");

    dragDrop.classList.add("hideForm");
    readout.classList.add("hideForm");
    loading.classList.remove("hideForm");

    return uploadFile(fileForm).then(function(result){
        var resultHead = document.getElementById("uploadResultHeader");
        var resultBody = document.getElementById("uploadResultBody");
        resultBody.innerText = "";

        if (result.hasOwnProperty("cardData") && result.hasOwnProperty("cardCount")) {
            resultHead.innerText = "Successfully uploaded "+result.cardCount+" cards";
            document.getElementById("cubeFileData").value = result.cardData;
        } else {
            resultHead.innerText =  "File is empty or incorrect format";
            resultBody.innerText = "Please refresh and try another file.\nPreferred format is one card name per line and no additional data.";
        }

        if (result.hasOwnProperty("missing") && result.missing.length) {
            resultBody.innerText = "Unable to find "+result.missing.length+" cards:\n" + result.missing.join('\n');
        }

        if (result.hasOwnProperty("error")) {
            console.error("Error uploading file: "+result.error);
        }

        dragDrop.classList.add("hideForm");
        loading.classList.add("hideForm");
        readout.classList.remove("hideForm");
    }).catch( function(err){
        resultHead.innerText =  "Error encountered during upload";
        resultBody.innerText = "Please refesh and try again.";
        dragDrop.classList.add("hideForm");
        loading.classList.add("hideForm");
        readout.classList.remove("hideForm");
        return console.error('Upload failed',err);
    });
}
addWindowListenerAllBrswrs("load", initListeners, false);