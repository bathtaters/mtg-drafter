// Setup listeners
function initListeners() {
    // Fixes Box listeners
    addListenerAllBrswrs(document.getElementById("fixesBox"),"click",clickFixesBox);
    addListenerAllBrswrs(document.getElementById("fixesBox"),"dblclick",chooseFixDetail);

    addListenerAllBrswrs(document.getElementById("fixNew"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixEdit"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixDelete"),"click",clickFixButton);
    
    addListenerAllBrswrs(document.getElementById("fixApply"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixRevert"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixClearAll"),"click",clickFixButton);

    addListenerAllBrswrs(document.getElementById("fixImport"),"click",clickFixButton);
    addListenerAllBrswrs(document.getElementById("fixFile"),"change", uploadFixList);
    

    // Fixes Editor listeners
    addListenerAllBrswrs(document.getElementById("key"),"change",enterKey);
    addListenerAllBrswrs(document.getElementById("uuid"),"blur",enterUuid);
    addListenerAllBrswrs(document.getElementById("uuid"),"keydown",enterUuid);

    addListenerAllBrswrs(document.getElementById("fixSave"),"click",clickEditorButton);
    addListenerAllBrswrs(document.getElementById("fixCancel"),"click",clickEditorButton);

}


// --- Shared Functions --- //

function getCardData(uuid) {
    return updateServer("card",{uuid: uuid},"./editor").then( function(result) {
        if (!result || result.invalid) {
            document.getElementById("key").setAttribute("disabled","true");
            document.getElementById("current").innerText = "";
            document.getElementById("cardName").innerText = result ? "Invalid UUID" : "No response from server";
            return;
        }
        return result;
    });
}

function getSettingData(key, id=null) {
    return updateServer("setting",{key: key, id: id},"./editor").then( function (setting) {
        if (!setting || setting.invalid) { 
            document.getElementById("value").value = "";
            document.getElementById("original").innerText = "";
            setting ? log("Get setting: "+setting.result) :
                log("No response from server","Could not retrieve settings key: "+key+", id: "+id);
        }
        else { return setting; }
    });
}

function updateValues(setting) {
    document.getElementById("value").value = JSON.stringify(setting.value) || "";
    document.getElementById("original").innerText = JSON.stringify(setting.original) || "Empty";
}

function updateCurrent(card, key=null) {
    if (!key) {
        var selected = getSelectedOptions(document.getElementById("key"));
        if (selected && selected.length > 0) {
            key = selected[0];
        }
        if (!key) { 
            document.getElementById("current").innerText = "Choose setting";
            return log("No key selected","Select key to retrieve current value.");
        }
    }
    if (typeof card === "string") {
        return getCardData(card).then( function(result) { if (result) {
                document.getElementById("current").innerText = JSON.stringify(result.card[key]) || "Empty";
        } });
    }
    document.getElementById("current").innerText = JSON.stringify(card[key]) || "Empty";
}

function updateAll(key, id=null) {
    return getSettingData(key, id).then( function(setting) { if (setting) {
        var elemIds = ["onlyModel", "uuid", "key"];
        var elemVals = [
            setting.model, setting.id, setting.key
        ];
        
        return updateCard(setting.id).then( function (card) {
            if (!card) { return log("Card not found",setting.id+" is not a valid card."); }
            
            for (var i = 0, l = elemIds.length; i < l; i++) {
                var elem = document.getElementById(elemIds[i]);
                if (elem.id == "onlyModel") {
                    elem.value = elemVals[i];
                    elem.innerText = elemVals[i];
                }
                if (elem.tagName == "SELECT") {
                    selectOption(elem,elemVals[i]);
                    // enterKey(elem);
                } else if (elem.tagName == "INPUT") {
                    elem.value = elemVals[i];
                } else {
                    elem.innerText = elemVals[i];
                }
            }
            updateValues(setting);
            return updateCurrent(card, setting.key);
        });
    } });    
}

function updateCard(uuid) {
    return getCardData(uuid).then( function(result) { if (result) {
        var keyMenu = document.getElementById("key");
        setSelectOptions(keyMenu, result.keys);
        keyMenu.removeAttribute("disabled");
        document.getElementById("cardName").innerText = result.card.printedName + " (" + result.card.setCode + ")";
        return result.card;
    } });
}

function updateSetting(key, id=null) {
    return getSettingData(key, id).then( function(setting) { if (setting) {
        updateValues(setting);
    } });
}

function showEditor() {
    document.getElementById("fixEditBgd").classList.remove("hidden");
    document.getElementById("fixEditBox").classList.remove("hidden");
}

function reload() { location.reload(); }

// --- Listener Functions --- //

// Click button in main interface
function clickFixButton(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: fixes."+action);

    if (action == "New") {
        return showEditor();

    } else if (action == "Edit") {
        var selected = getSelectedOptions(document.getElementById("fixesBox"));
        if (selected.length > 0) {
            return updateAll(selected[0]).then(showEditor);
        }

    } else if (action == "Delete") {
        var keys = getSelectedOptions(document.getElementById("fixesBox"));
        if (confirm("Are you sure you want to revert & delete the selected setting(s): " + keys + "?")) {
            return updateServer("clear",{keys: keys}, "./").then(reload);
        }

    }  else if (action == "Apply All") {
        return updateServer("applyAll",{}, "./").then(reload);

    }  else if (action == "Revert All") {
        return updateServer("revertAll",{}, "./").then(reload);

    }  else if (action == "Delete All") {
        if (confirm("Are you sure you want to delete all settings? They will not be recoverable.")) {
            return updateServer("revertAll",{}, "./")
                .then(_=>updateServer("clearAll",{}, "./")).then(reload);
        }
    
    }  else if (action == "Import") {
        var filePicker = document.getElementById("fixFile");
        if (filePicker.classList.contains("hidden")) { filePicker.classList.remove("hidden"); }
        else { filePicker.classList.add("hidden"); }

    } else {
        log("Not Implemented",action+" action has no implementation.");
    }
}


// Clicking in multi-selection box
function clickFixesBox(e) {
    setButtonStatus(this || e.target || e.srcElemnt, ["fixEdit","fixDelete"])
}
function chooseFixDetail() { document.getElementById("fixEdit").click(); }



// Click button in editor interface
function clickEditorButton(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var action = elem.value;
    log("clicked: fixes."+action);

    if (action == "Save") {
        var editorForm = new FormData(document.getElementById("fixesEditor"))
        return postFormData("set",editorForm,"./").then(reload);

    } else if (action == "Cancel") {
        return location.reload();
    
    } else {
        log("Not Implemented",action+" action has no implementation.");
    }
}

function enterKey(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var key = elem.value;
    log("changed: fixes.key");

    var uuid = document.getElementById("uuid");
    uuid = uuid.innerText || uuid.value;
    return updateSetting(key, uuid).then(updateCurrent(uuid, key));
}

function enterUuid(e) {
    // stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    var uuid = elem.value;
    log("changed: fixes.uuid");

    return updateCard(uuid);
}

// Upload
function uploadFixList(e) {
    var elem = this || e.target || e.srcElemnt;
    var fileForm = new FormData();
    fileForm.append("fixList", elem.files[0]);
    elem.classList.add("hidden");

    if (confirm("Importing may overwrite conflicting settings. Are you sure?")) {
        uploadFile(fileForm, url='./import').then(reload);
    }
}

addWindowListenerAllBrswrs("load", initListeners, false);