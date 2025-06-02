import type { BasicPlayer, Game } from "types/game";
import {
  PlayerJoinContainer,
  PlayersWrapper,
  PlayerWrapper,
  PlayerButton,
} from "./PlayerJoinStyles";
import { gameIsLocked } from "../shared/game.utils";
import { FullGame, viewedMsg } from "assets/strings";

type Props = {
  title: string;
  slots: BasicPlayer["id"][];
  players: BasicPlayer[];
  hasViewed?: boolean;
  selectPlayer?: (id: BasicPlayer["id"]) => void;
  game?: Partial<Game & { locked: boolean }>;
};

export default function PlayerJoin({
  title,
  slots,
  players,
  hasViewed,
  selectPlayer,
  game,
}: Props) {
  const isLocked =
    game?.locked != null ? game.locked : gameIsLocked(game?.id, game?.banned);
  if (isLocked)
    return (
      <PlayerJoinContainer title="This Game has been locked by the host">
        <FullGame />
      </PlayerJoinContainer>
    );

  if (hasViewed)
    return (
      <PlayerJoinContainer title={viewedMsg}>
        <FullGame />
      </PlayerJoinContainer>
    );

  if (!slots.length)
    return (
      <PlayerJoinContainer title="No Available Seats">
        <FullGame />
      </PlayerJoinContainer>
    );

  const playerSlots = players.filter(({ id }) => slots.includes(id));

  return (
    <PlayerJoinContainer title={title}>
      <PlayersWrapper>
        {playerSlots.map(({ id, name }) => (
          <PlayerWrapper key={id}>
            <PlayerButton
              label={name}
              onClick={selectPlayer && (() => selectPlayer(id))}
            />
          </PlayerWrapper>
        ))}
      </PlayersWrapper>
    </PlayerJoinContainer>
  );
}
