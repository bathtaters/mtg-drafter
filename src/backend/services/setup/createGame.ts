import type { CubeOptions, GenericOptions } from 'types/setup'
import prisma from '../../libs/db'
import { createPacks, createPlayers, randomUrl } from '../../utils/game/game.utils'

export async function newCubeGame({ packSize, cardList, ...options }: CubeOptions, hostSessionId?: string) {
  return newGame({ ...options, packs: createPacks(cardList, options.playerCount * options.roundCount, packSize) }, hostSessionId)
}


// Generic Creator

async function newGame(options: GenericOptions, sessionId?: string) {

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
  
  if (!sessionId) return url
  const host = await prisma.player.findFirst({ where: { gameId: id }})
  if (!host) return url
  
  // Add host
  await prisma.$transaction([
    prisma.player.update({
      where: { id: host.id },
      data: { sessionId }
    }),
    prisma.game.update({
      where: { id },
      data: { hostId: host.id }
    })
  ])
  return url
}
