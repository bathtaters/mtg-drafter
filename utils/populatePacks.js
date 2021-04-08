// Retrieve card data from database

const Card = require('../models/card');
const { draftStatus, groupTitles, directionText } = require('../config/definitions');

// Projection for retrieving card data
const packProjections = { variations: 0, printings: 0 };
// Fields to copy from draft data {draftKey: resultKey} (falsy = use draftKey as resultKey)
const draftFields = ['draftId', 'foil', 'picked'];

// Combine draft data w/ card data
async function populateCard(cardUuid, draftCard) {
  let newCard = await Card.findById(cardUuid, packProjections);
  newCard = newCard.toObject();
  const draftObj = draftCard.toObject();
  
  draftFields.forEach( f => newCard[f] = draftObj[f]);
  return newCard;
}

// Main function
async function populatePack(packArray) {
  if(!packArray) return [];
  
  let result = [];
  for (let i=0, end=packArray.length; i < end; i++) {

    let newCard = await populateCard(packArray[i].uuid, packArray[i]);
    
    // Populate reverse face in front face 'related' field
    if (newCard.side == 'a') {
      let related = [];
      for (const faceId of newCard.otherFaceIds) {
        const newFace = await populateCard(faceId, packArray[i]);
        related.push(newFace);
      }
      newCard['related'] = related;
    }

    result.push(newCard);
    //console.log(JSON.stringify(newCard)+'\n');
  }
  return result;
}


// Get player-data (formatted for draft.pug)
const playerPopulate = (player, isOppo, isActive) => { return {
  name: player.name,
  packsHeld: player.packsHeld,
  pickNum: player.pick + 1,
  isConnected: player.connected,
  isOpponent: isOppo,
  isActive: isActive
};}

// Get draft-data (formatted for draft.pug)
const draftPopulate = async (draft,player) => {
  const oppoId = player.opponent ? player.opponent._id : null;
  return {
    draftName: draft.name || 'Unnamed Draft',
    roundNum: draft.round + 1,
    status: draft.status,
    activePlayer: playerPopulate(player),
    pack: await populatePack(player.currentPack),
    cards: {
      main: await populatePack(player.cards.main),
      side: await populatePack(player.cards.side)
    },
    playerList: draft.players.map( user =>
      playerPopulate(
        user, user._id == oppoId,
        user._id == player._id
      )
    ),
    isHost: draft.hostId.toString() == player._id.toString(),
    totalRounds: draft.packs.length,
    passRight: draft.direction == -1,
    groupTitles: groupTitles,
    draftUrl: draft.url,
    landData: player.getLandData()
  };}


module.exports = {
  all: populatePack,
  draftOnly: draftPopulate
}
