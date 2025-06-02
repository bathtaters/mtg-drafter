import { type PlayerFull, type ServerProps, PlayerStatus } from "types/game";
import { useState } from "react";
import { useGameEmitters } from "./services/socket.controller";
import downloadDeck from "./services/downloadDeck.controller";
import { enableDropping } from "assets/constants";
import useBasicGameController from "./basic.controller";

export default function useGameController(props: ServerProps) {
  const [landModal, setLandModal] = useState(false);
  const [hostModal, setHostModal] = useState(false);
  const [logModal, setLogModal] = useState(false);

  const local = useBasicGameController(props, hostModal, setHostModal);

  const toggleLandModal = !local.player?.basics
    ? undefined
    : () => setLandModal((o) => !o);
  const toggleHostModal = !local.isHost
    ? undefined
    : () =>
        setHostModal((o) => {
          if (!o) local.gameLog.fetch();
          return !o;
        });
  const toggleLogModal = !local.isHost
    ? undefined
    : () => setLogModal((o) => !o);

  const {
    renamePlayer,
    setOptions,
    nextRound,
    pauseGame,
    pickCard,
    swapCard,
    setLands,
    setStatus,
    setWatchPw,
    dropWatcher,
    banSession,
  } = useGameEmitters(local, local.newError);

  const saveDeck =
    !local.player?.cards || !local.game
      ? undefined
      : () => {
          downloadDeck(local as Parameters<typeof downloadDeck>["0"]);
        };

  const dropPlayer =
    !enableDropping || !local.player
      ? undefined
      : () => {
          local.setSidebar(false);
          setStatus((local.player as PlayerFull).id, PlayerStatus.leave);
        };

  return {
    ...local,
    renamePlayer,
    setOptions,
    nextRound,
    pauseGame,
    pickCard,
    swapCard,
    setLands,
    setStatus,
    setWatchPw,
    dropWatcher,
    banSession,

    landModal,
    hostModal,
    logModal,
    saveDeck,
    dropPlayer,
    toggleLandModal,
    toggleHostModal,
    toggleLogModal,
  };
}
