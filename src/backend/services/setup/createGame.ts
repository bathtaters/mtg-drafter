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

  const game = await retry(() => prisma.game.create({
    select: {
      id: true, name: true, url: true,
      roundCount: true, timerBase: true, hostId: true,
    },
    data: {
      name: options.name,
      url: randomUrl(),
      roundCount: options.roundCount,
      hostId: sessionId,
      players: { create: createPlayers(options.playerCount) },
      timerBase: options.timer || null,
      packs: { create: options.packs.map((pack,index) => ({
        index,
        cards: { create: pack }
      })) },
    },
  }))

  await retry(() => prisma.logEntry.create({
    data: { gameId: game.id, byHost: true, action: 'settings', data: JSON.stringify(game) }
  }))
  return game.url
}
