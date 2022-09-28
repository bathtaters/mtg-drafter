import { Game } from "../../../models/Game";

export const getRound = ({ round, roundCount }: { round: number, roundCount: number }) =>
  round > roundCount ? 'Finished' : round <= 0 ? 'Awaiting' : 
    `Pack ${round} of ${roundCount}`

export const getOppIdx = (playerIdx: number, playerCount: number) => {
  const f = Math.floor(playerCount / 2);
  if (!f || playerIdx >= 2 * f) return;
  return (playerIdx + f) % (2 * f);
}

export const passingUp = ({ round, roundCount }: { round: number, roundCount: number }) =>
  round < 1 || round > roundCount ? undefined :
    round % 2 === 0

export const getPrevPlayerIdx = ({ players, round, roundCount }: Game, playerIdx: number) =>
  passingUp({ round, roundCount }) ? (playerIdx - 1 + players.length) % players.length : (playerIdx + 1) % players.length

export const getPackIdx = ({ round, roundCount, players }: Game, playerIdx: number, neighborIdx: number) => {
  if (round < 1 || round > roundCount) return
  if (players[playerIdx].pick > players[neighborIdx].pick) return
  return (round - 1) * players.length + (playerIdx + players[playerIdx].pick) % players.length
}
