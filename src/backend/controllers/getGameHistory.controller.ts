import prisma from 'backend/libs/db'
import type { GetServerSidePropsContext } from 'next'
import type { GameHistoryServerSideProps } from 'types/game'
import { getCtxSessionId } from '../libs/auth'

export default async function handler(ctx: GetServerSidePropsContext): Promise<GameHistoryServerSideProps> {
    const sessionId = getCtxSessionId(ctx)

    try {
        const games = await prisma.game.findMany({
            where: { players: { some: { sessionId } } },
            select: {
                id: true,
                name: true,
                url: true,
                hostId: true,
                players: {
                    where: { sessionId },
                    select: { id: true, name: true, sessionId: true, pick: true }
                },
            },
        })

        return {
            games: games.map(({ players, ...game }) => ({
                ...game,
                player: players[0]
            }))
        }

    } catch (err: any) {
        return { error: err?.message ?? String(err) }
    }
}
