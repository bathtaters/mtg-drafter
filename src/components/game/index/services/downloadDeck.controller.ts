import type { Game, Board, Card } from "@prisma/client"
import type { BoardLands, BasicLands, PlayerFull } from "types/game"
import { deckSort } from "components/base/services/cardSort.services"
import downloadTextFile from "components/base/libs/download"
import { colorOrder, landNames } from 'assets/sort.constants'


const deckFileName = (game: Game, player: PlayerFull) =>
  `${player?.name || 'Player'} - ${game?.name || 'Draft'} Deck`

const basicLandText = (lands: BoardLands, preLineBreak = true) => {
  const list = colorOrder.filter((c) => lands[c]).map((c) => `${lands[c]} ${landNames[c]}`)
  return list.length ? `${preLineBreak ? '\n' : ''}${list.join('\n')}\n` : ''
}

const formatDeckFile = (main: string[], side: string[], lands: BasicLands) =>
  `${main.join('\n')}${basicLandText(lands.main, !!main.length)}\nSideboard\n${side.join('\n')}${basicLandText(lands.side, !!side.length)}`


export default function downloadDeck({ game, player }: { game: Game, player: PlayerFull }) {
  let cardList: { [board in Board]: Card[] } = { main: [], side: [] }

  player.cards.forEach(({ board, card }) => cardList[board].push(card) )

  Object.values(cardList).forEach((list) => list.sort(deckSort))

  downloadTextFile(
    deckFileName(game, player),

    formatDeckFile(
      cardList.main.map(({ name }) => name),
      cardList.side.map(({ name }) => name),
      player.basics as BasicLands
    )
  )
}