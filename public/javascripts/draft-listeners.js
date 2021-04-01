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
}
function clickCard(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    console.log("single clicked: "+elem.id);

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
    }
    // ADD CODE FOR MOVING MAIN/SIDE BOARD CARDS
}
function dblClickCard(e) {
    stopPropagationAllBrswrs(e);
    var elem = this || e.target || e.srcElemnt;
    console.log("double clicked: "+elem.id);

    if (elem.classList.contains('pack')) {
        // If this is a 'pack' card, and it's already selected, choose it
        var savedCard = document.getElementById('selectedDraftId');
        if (elem.id == savedCard.value) {
            var button = document.getElementById("pickButton");
            if(button) { button.click(); }
        }
    } else if (elem.classList.contains('main') || elem.classList.contains('side')) {
        console.error('cannot move: sideboard is disabled')
    }
}
function deselectCard() {
    console.log("clicked: bgd");
    var savedCard = document.getElementById('selectedDraftId');

    // Disable button
    var button = document.getElementById("pickButton");
    if(button) { button.setAttribute('disabled', true); }

    // De-select card and clear the hidden field
    if (savedCard && savedCard.value) {
        document.getElementById(savedCard.value).classList.remove('selected');
        savedCard.value = '';
    }
    //else console.error('no value set on selectedDraftId');
}
addWindowListenerAllBrswrs("load", initListeners, false);