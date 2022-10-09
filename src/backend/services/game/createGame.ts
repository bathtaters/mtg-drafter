import prisma from '../../libs/db'
import { createPacks, createPlayers, randomUrl } from '../../utils/game/game.utils'

export async function newCubeGame({ packSize, cardList, ...options }: CubeOptions) {
  return newGame({ ...options, packs: createPacks(cardList, options.playerCount * options.roundCount, packSize) })
}


// Generic Creator

async function newGame(options: GenericOptions) {

  const { id, url } = await prisma.game.create({ data: {
    name: options.name,
    url: randomUrl(),
    roundCount: options.roundCount,
    packSize: options.packs[0].length,
    players: { create: createPlayers(options.playerCount) },
    packs: { create: options.packs.map((pack,index) => ({
      index,
      cards: { create: pack.map((uuid) => ({ 
        card: { connect: { uuid } }
      })) }
    })) },
  }})
  
  if (!options.hostSessionId) return url
  const host = await prisma.player.findFirst({ where: { gameId: id }})
  if (!host) return url
  
  // Add host
  await prisma.$transaction([
    prisma.player.update({
      where: { id: host.id },
      data: { sessionId: options.hostSessionId }
    }),
    prisma.game.update({
      where: { id },
      data: { hostId: host.id }
    })
  ])
  return url
}


// TYPES

interface CommonOptions {
  name: string,
  playerCount: number,
  roundCount: number,
  hostSessionId?: string,
}

interface GenericOptions extends CommonOptions {
  packs: string[][],
}

export interface CubeOptions extends CommonOptions {
  packSize: number,
  cardList: string[],
}