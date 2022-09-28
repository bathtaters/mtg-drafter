import { Game } from '../../../../models/Game'
import type { NextApiRequest, NextApiResponse } from 'next'

const testGame = {
  id: '_TEST_ID',
  name: "Test Draft",
  url: "test_game",
  hostId: "1a",
  players: [
    {
      id: "_HOST_ID",
      name: 'Nick',
      sessionId: '1a',
      pick: 0,
      mainBoard: ['1','2','3'],
      sideBoard: ['4'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID1",
      name: 'Joven',
      sessionId: '2b',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID2",
      name: 'Bilge',
      sessionId: '3c',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID3",
      name: 'Brad',
      sessionId: '4d',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID4",
      name: 'Scott',
      sessionId: '5e',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID5",
      name: 'Markie',
      sessionId: '',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID6",
      name: 'Mark',
      sessionId: '7g',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    },{
      id: "_PLAY_ID7",
      name: 'SlogBoy',
      sessionId: '8h',
      pick: 0,
      mainBoard: ['5','6'],
      sideBoard: ['7','8'],
      basicLands: { w:0,u:0,b:0,r:0,g:0 },
    }
  ],
  packs: [
    ["(",")","*"],["+",",","-"],[".","/","0"],["1","2","3"],["4","5","6"],["7","8","9"],
    [":",";","<"],["=",">","?"],["@","A","B"],["C","D","E"],["F","G","H"],["I","J","K"],
    ["L","M","N"],["O","P","Q"],["R","S","T"],["U","V","W"],["X","Y","Z"],["[","\\","]"],
    ["^","_","`"],["a","b","c"],["d","e","f"],["g","h","i"],["j","k","l"],["m","n","o"]
  ],//Card[][],
  round: 1,
  roundCount: 3,
  isPaused: false,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Game>
) {
  // Retrieve data w/ [gameId]
  res.status(200).json(testGame)
}
