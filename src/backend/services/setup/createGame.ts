import type { BoosterOptions, CubeOptions, GenericOptions } from 'types/setup'
import prisma from '../../libs/db'
import retry from '../../libs/retry'
import { createPacks, createPlayers, randomUrl } from '../../utils/setup/setup.utils'
import buildBoosterPacks from './buildBoosters'

export async function newCubeGame({ packSize, cardList, ...options }: CubeOptions, hostSessionId?: string) {
  const packs = createPacks(cardList, options.playerCount * options.roundCount, packSize)
  return newGame({ ...options, packs }, hostSessionId)
}

export async function newBoosterGame({ packList, basics, ...options }: BoosterOptions, hostSessionId?: string) {
  const packs = await buildBoosterPacks(packList, options.playerCount, basics)
  return newGame({ ...options, roundCount: packList.length, packs }, hostSessionId)
}

// Generic Creator

async function newGame(options: GenericOptions, sessionId?: string) {

  const { id, url } = await retry(() => prisma.game.create({ data: {
    name: options.name,
    url: randomUrl(),
    roundCount: options.roundCount,
    players: { create: createPlayers(options.playerCount) },
    timerBase: options.timer || null,
    packs: { create: options.packs.map((pack,index) => ({
      index,
      cards: { create: pack }
    })) },
  }}))
  
  if (!sessionId) return url
  const host = await prisma.player.findFirst({ where: { gameId: id }, select: { id: true }})
  if (!host) return url
  
  // Add host
  await retry(() => prisma.$transaction([
    prisma.player.update({
      where: { id: host.id },
      data: { sessionId }
    }),
    prisma.game.update({
      where: { id },
      data: {
        hostId: host.id,
        log: { create: {
          action: 'join',
          data: sessionId,
          player: { connect: { id: host.id } },
          byHost: true,
        }},
      }
    })
  ]))
  return url
}
