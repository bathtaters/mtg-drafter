import type { Game, GameCard, Player } from "@prisma/client";
import type { PackFull, PlayerFullTimer } from "types/game";
import { getGame, getRoundPackSize } from "./game.services";
import { getBots } from "./player.services";
import {
  adaptDbPlayer,
  getCurrentPack,
  getHolding,
  getPlayerIdx,
} from "../../utils/game/game.utils";
import getAutopickCard from "components/base/services/autoPick.service";

export type PickData = [Player["id"], GameCard["id"]];

let botPickLock = false;

export async function getBotPicks(gameId: Game["id"]): Promise<PickData[]> {
  if (botPickLock) return [];
  botPickLock = true;

  // Collect data from DB
  const bots = await getBots(gameId);
  if (!bots.length) {
    botPickLock = false;
    return [];
  }

  const game = await getGame(undefined, true, gameId);
  if (!game) {
    botPickLock = false;
    throw new Error(`Game not found: <${gameId}>`);
  }
  const packSize = await getRoundPackSize(
    game.id,
    game.round,
    game.roundCount,
    game.players.length
  );

  // Calculate derived data
  const { players = [], packs = [], ...options } = game;

  const idxBots = bots.map((bot) => ({
    ...(adaptDbPlayer(bot) as PlayerFullTimer),
    idx: getPlayerIdx(players, bot),
  }));
  if (idxBots.some(({ idx }) => idx < 0)) {
    botPickLock = false;
    throw new Error(
      `Bot(s) not found: ${idxBots
        .filter(({ idx }) => idx < 0)
        .map(({ name }) => name)
        .join(", ")}`
    );
  }

  // Iterate through all bots, preparing picks until no more picks can be made
  let hasPicked = true,
    picks: PickData[] = [];
  while (hasPicked) {
    hasPicked = false;
    for (const bot of idxBots) {
      let holding = getHolding(players, packSize, options)[bot.idx];
      while (holding-- > 0) {
        // Fetch current pack
        const pack = getCurrentPack({
          player: bot,
          players,
          options,
          packs: packs as PackFull[],
        });
        if (!pack) {
          botPickLock = false;
          throw new Error(`No pack found for bot: ${bot.name} (${bot.pick})`);
        }

        // Run autopick algorithm
        const card = getAutopickCard(pack, bot.cards);
        if (!card) {
          botPickLock = false;
          throw new Error(
            `No cards left in pack ${pack.index} for bot: ${bot.name} (${bot.pick}).`
          );
        }

        // Simulate card pick in cache
        bot.pick++;
        players[bot.idx].pick++;
        bot.cards.push(card);
        card.playerId = bot.id;
        card.board = "main";

        // Append pick to transaction list, update loop vars
        picks.push([bot.id, card.id]);
        hasPicked = true;
      }
    }
  }
  botPickLock = false;
  return picks;
}
