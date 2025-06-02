import type { MouseEvent } from "react";
import type { GameCard } from "@prisma/client";
import type { AlertsReturn } from "components/base/common/Alerts/alerts.hook";
import type {
  Game,
  CardOptions,
  PackFull,
  PartialGame,
  PickCard,
  PlayerFull,
  SwapCard,
  Board,
  BasicPlayer,
} from "types/game";
import { TabLabels } from "types/game";
import { useCallback, useRef, useState, useEffect } from "react";
import { useTimer, useLoadElements } from "components/base/libs/hooks";
import getAutopickCard from "components/base/services/autoPick.service";
import { usePickInfo } from "../PackViewer/packViewer.controller";
import { redTimerSeconds } from "assets/constants";

const DBL_CLICK_DELAY = 500,
  NEXT_PICK_DELAY = 100;

export function useTabController<Tabs extends string>(
  initialTab: Tabs,
  game?: Partial<Game>,
  players?: BasicPlayer[],
  skipPickInfo = true
) {
  const pickInfo = usePickInfo(game, players, skipPickInfo);
  const [selectedTab, selectTab] = useState<Tabs>(initialTab);
  const [cardOptions, setCardOptions] = useState<CardOptions>({
    width: "",
    showArt: true,
    sort: undefined,
  });

  return { pickInfo, selectedTab, selectTab, cardOptions, setCardOptions };
}

export default function usePickController(
  pickCard: PickCard,
  swapCard: SwapCard,
  notify: AlertsReturn["newToast"],
  pack?: PackFull,
  game?: Game | PartialGame,
  player?: PlayerFull,
  isHost?: boolean,
  playerTimer?: number,
  onPackLoad?: () => void
) {
  const hidePack =
    !game ||
    !("round" in game) ||
    game.round > game.roundCount ||
    game.round < 1;
  const packViewer =
    isHost &&
    game &&
    "round" in game &&
    (!player || game.round > game.roundCount);

  const lastClick = useRef(-1);
  const nextPickAllowed = useRef(0);
  const { selectedTab, selectTab, cardOptions, setCardOptions } =
    useTabController<TabLabels>(hidePack ? TabLabels.main : TabLabels.pack);
  const [selectedCard, setSelectedCard] = useState<GameCard["id"]>();
  const [autopickCard, setAutopickCard] = useState<string | number>();

  const autoPick = useCallback(() => {
    if (
      typeof autopickCard === "undefined" ||
      nextPickAllowed.current > Date.now()
    )
      return;
    nextPickAllowed.current = Date.now() + NEXT_PICK_DELAY;

    pickCard(selectedCard || autopickCard);
    setSelectedCard(undefined);
    setAutopickCard(undefined);
  }, [autopickCard, selectedCard, pickCard]);

  const clickPickButton = useCallback(() => {
    if (typeof pack?.index !== "number")
      return notify({ message: "Cannot pick without a pack.", theme: "error" });
    if (!selectedCard && pack.cards.length)
      return notify({
        message: "Cannot pick before selecting a card.",
        theme: "error",
      });
    if (nextPickAllowed.current > Date.now())
      return notify({
        message: "Your picks were too quick, try again after closing this.",
        theme: "info",
      });
    nextPickAllowed.current = Date.now() + NEXT_PICK_DELAY;

    pickCard(selectedCard || pack.index);
    setSelectedCard(undefined);
    setAutopickCard(undefined);
  }, [selectedCard, pack, notify, pickCard]);

  const clickPackCard = useCallback(
    (id: GameCard["id"], ev: MouseEvent) => {
      ev.stopPropagation();
      if (
        ev.detail > 1 &&
        id === selectedCard &&
        lastClick.current + DBL_CLICK_DELAY > ev.timeStamp
      )
        return clickPickButton();
      if (id === selectedCard) lastClick.current = ev.timeStamp;
      setSelectedCard(id);
      ev.preventDefault();
    },
    [selectedCard, clickPickButton]
  );

  const clickBoardCard = useCallback(
    (board: Board) => (id: GameCard["id"], ev: MouseEvent) => {
      swapCard(id, board === "side" ? "main" : "side");
      ev.preventDefault();
    },
    [swapCard]
  );

  const deselectCard = useCallback(() => {
    setSelectedCard(undefined);
  }, []);

  const timer = useTimer(playerTimer, (game as Game)?.pause, autoPick);

  const [packLoading, handleCardLoad] = useLoadElements(
    onPackLoad,
    pack?.cards.length,
    !cardOptions.showArt,
    [pack?.index]
  );

  useEffect(() => {
    if (hidePack && !packViewer && selectedTab === "pack")
      selectTab(TabLabels.main);
  }, [hidePack, packViewer, selectedTab, selectTab]);

  useEffect(() => {
    if (typeof pack?.index === "number") {
      if (pack.cards.find(({ playerId }) => !playerId))
        selectTab(TabLabels.pack);
      setAutopickCard(getAutopickCard(pack, player?.cards)?.id || pack.index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack, player?.id, player?.cards.length]);

  return {
    autopickCard:
      typeof autopickCard === "string" && timer && timer < redTimerSeconds
        ? autopickCard
        : undefined,
    selectedCard,
    deselectCard,
    clickPickButton,
    clickPackCard,
    clickBoardCard,
    cardOptions,
    setCardOptions,
    selectedTab,
    selectTab,
    hidePack,
    packViewer,
    timer,
    packLoading,
    handleCardLoad,
  };
}
