// Create all listeners

function initListeners() {
    
    // De-select listeners for clicking on the document body
    var body = document.body || document.getElementsByTagName("BODY")[0];
    addListenerAllBrswrs(body,"click",deselectCard);

    // Don't de-select when you click the button
    var button = document.getElementById("pickButton");
    if(button) {
        addListenerAllBrswrs(button,"click",stopPropagationAllBrswrs);
    }
    
    // Add click & dblclick listeners to every card
    var cards = document.getElementsByClassName("cardContainer");
    for (var i = 0, l = cards.length; i < l; i++) {
        addListenerAllBrswrs(cards[i],"click",clickCard);
        addListenerAllBrswrs(cards[i],"dblclick",dblClickCard);
    }

    // Show/Hide main/side boards
    var mainboard = document.getElementById("mainHeader");
    var sideboard = document.getElementById("sideHeader");
    if (mainboard) { addListenerAllBrswrs(mainboard,"click",clickHideGroup); }
    if (sideboard) { addListenerAllBrswrs(sideboard,"click",clickHideGroup); }

    // Copy link button (Host only)
    var copyLink = document.getElementById("linkButton");
    if (copyLink) {
        addListenerAllBrswrs(copyLink,"click",copyUrl);
    }

    // Rename player
    addListenerAllBrswrs(document.getElementById("renameBox"),"blur",renamePlayer);

    // Download decklist
    addListenerAllBrswrs(document.getElementById("dlButton"),"click",downloadTextFile);

    // Land ops
    addListenerAllBrswrs(document.getElementById("resetLands"),"click",resetLandCounts);
    addListenerAllBrswrs(document.getElementById("autoLands"),"click",setAutoLandCounts);

    // Add lands
    var landTool = document.getElementById("landBox");
    addListenerAllBrswrs(landTool,"mouseleave",updateLands);
    addListenerAllBrswrs(landTool,"click",stopPropagationAllBrswrs);
    
    // Poll when waiting
    if (document.getElementById('preMsg')) {
        log('watching for draft to be ready');
        poll('isReady').then( function(_){
            log('draft is ready');
            location.reload();
        });
    } else if (document.getElementById('waitingMsg')) {
        log('watching for pack to be ready');
        poll('packReady').then( function(_){
            log('pack is ready');
            location.reload();
        });
    }

    log('listeners started');
}


// Listeners for clicking cards

function clickHideGroup(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("show/hide "+elem.id);

    var prefix = elem.id.slice(0, -("Header".length));

    if (prefix) {
        var container = document.getElementById(prefix+"Container");
        var hideText = document.getElementById(prefix+"Hider");
        if (container.classList.contains("hiddenGroup")) {
            container.classList.remove("hiddenGroup");
            hideText.innerText = "–"; // en-dash
        } else {
            container.classList.add("hiddenGroup");
            hideText.innerText = "+";
        }
    }
}

function clickCard(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("single clicked: "+elem.id);

    if (elem.classList.contains('pack')) {
        // If this is a pack card, see which one is selected
        var savedCard = document.getElementById('selectedDraftId');
        var savedId = savedCard.value;

        if (savedId != elem.id) {
            // De-select previous card
            if (savedId) {
                document.getElementById(savedId).classList.remove('selected');
            }

            // Select new card
            elem.classList.add('selected');
            savedCard.value = elem.id

            // Enable button if it was disabled
            if (!savedId) {
                document.getElementById('pickButton').removeAttribute('disabled');
            }
        }
    } else {
        var hasSide = elem.classList.contains('side');
        updateServer('swap',{draftId: elem.id, fromSide: hasSide})
            .then( function(result){
                if (result.moveTo == 'side') {
                    document.getElementById('sideContainer').appendChild(elem);
                    elem.classList.replace('main','side');

                    var oldCount = document.getElementById('mainCount');
                    oldCount.innerText = +oldCount.innerText - 1;
                    var newCount = document.getElementById('sideCount');
                    newCount.innerText = +newCount.innerText + 1;

                } else if (result.moveTo == 'main') {
                    document.getElementById('mainContainer').appendChild(elem);
                    elem.classList.replace('side','main');

                    var oldCount = document.getElementById('sideCount');
                    oldCount.innerText = +oldCount.innerText - 1;
                    var newCount = document.getElementById('mainCount');
                    newCount.innerText = +newCount.innerText + 1;
                } else {
                    log('Card swap returned value: '+JSON.stringify(result));
                }       
            }).catch(function(err){log('Error swapping card',err);});
    }
}

function dblClickCard(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    log("double clicked: "+elem.id);

    if (elem.classList.contains('pack')) {
        // If this is a 'pack' card, and it's already selected, choose it
        var savedCard = document.getElementById('selectedDraftId');
        if (elem.id == savedCard.value) {
            var button = document.getElementById("pickButton");
            if(button) { button.click(); }
        }
    }
}

function deselectCard() {
    log("clicked: bgd");
    var savedCard = document.getElementById('selectedDraftId');

    // Disable button
    var button = document.getElementById("pickButton");
    if(button) { button.setAttribute('disabled', true); }

    // De-select card and clear the hidden field
    if (savedCard && savedCard.value) {
        document.getElementById(savedCard.value).classList.remove('selected');
        savedCard.value = '';
    }
    //else log('no value set on selectedDraftId');
}


// Listeners for clicking buttons

function copyUrl(e) {
    stopPropagationAllBrswrs(e);
    
    // Copy to clipboard
    var copyText = document.getElementById("draftUrl");
    copyTextToClipboard(copyText.innerText);

    // Notify user via tooltip
    var copyMsg = document.getElementById("copyMsg");
    var origMsg = copyMsg.innerHTML;
    copyMsg.innerHTML = "Copied!";

    // Change text back after 2 seconds
    setTimeout(
        function() { copyMsg.innerHTML = origMsg; },
        2000
    );
    
}

function downloadTextFile(e) {
    stopPropagationAllBrswrs(e);
    // downloadFile()
    //     .catch(function(err){log('Error downloading deck',err);});
}


function resetLandCounts(e) {
    var landBoxes = document.getElementsByClassName('mainLands');
    var count = landBoxes.length;
    for (var i = 0; i < count; i++) {
        landBoxes[i].value = 0
    }
    updateLands(e);
    log('reset basic land counts')
}

function setAutoLandCounts(e) {
    updateServer('autoLands').then(result => {
        log('auto-set lands');
        setLandsTo(result.lands);
    });
}

function setLandsTo(landObj) {
    var landBoxes = document.getElementsByClassName('mainLands');
    var count = landBoxes.length;
    for (var i = 0; i < count; i++) {
        var nextLand = landObj[landBoxes[i].id];
        if (nextLand !== undefined) { landBoxes[i].value = nextLand; }
    }
    updateLands(0);
}


function updateLands(e) {
    var landData = new FormData(document.getElementById('landTool'));
    log('Updated basic land count');
    return postFormData('lands',landData);
    
}

function renamePlayer(e) {
    var elem = this || e.target || e.srcElemnt;
    // Rename on Server
    updateServer('rename',{name: elem.innerText})
        .then( function(result){
            log('Name saved as '+result.name);
            if (result.name) {
                // Update textbox
                elem.innerText = result.name;
                // Update ticker box
                document.getElementById("tickerActiveName").innerText = result.name;
            }
        }).catch(function(err){log('Error renaming player',err);});
}

addWindowListenerAllBrswrs("load", initListeners, false);