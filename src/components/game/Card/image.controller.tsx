import { CardFull, Direction } from "types/game";
import Image from "next/image";
import { useState, useEffect, useCallback, ReactNode, useMemo } from "react";
import {
  showFlipButton,
  getNextFace,
  isReversible,
} from "./RenderedCard/card.services";
import { HoverAction, useHoverClick } from "components/base/libs/hooks";
import {
  layoutDirection,
  typeDirection,
  serverSideImageOptimize,
} from "assets/constants";
import { matchWidth } from "../CardToolbar/cardZoomLevels";

const zoomLevelToWidth = (zoomClass: string) => {
  const w = zoomClass.match(matchWidth)?.[1];
  return w ? w + "rem" : "100vw";
};

export default function useCardImage(
  card: CardFull,
  zoomClass: string,
  showImages = true,
  onLoad?: () => Promise<void> | void
) {
  const cardFaces = useMemo(
    () => [
      card,
      ...card.otherFaces.map(({ card, backImg: img }) =>
        img ? { ...card, img } : card
      ),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [card.uuid]
  );
  const frontRotate = useMemo(
    () =>
      Object.entries(typeDirection).find(([type]) =>
        card.types.includes(type)
      )?.[1],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [card.uuid]
  );
  const sideCount = cardFaces.length;

  const [images, setImages] = useState([] as ReactNode[]);
  const [sideIdx, setSideIdx] = useState(sideCount > 1 ? 0 : -1);
  const [rotation, setRotation] = useState<Direction>();

  const direction: Direction | undefined =
    sideIdx === 1 && sideCount === 2
      ? layoutDirection[card.layout || "normal"]?.(card, showImages)
      : sideIdx < 1
        ? rotation
        : undefined;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeCardSide = useCallback(
    sideCount < 3
      ? // Normal action
        (state: HoverAction) =>
          setSideIdx(
            state < HoverAction.Click
              ? state
              : state === HoverAction.FirstClick
                ? 1
                : (idx) => getNextFace(idx, sideCount)
          )
      : // 3+ Faced Card
        (state: HoverAction) =>
          state !== HoverAction.Leave &&
          setSideIdx((idx) => getNextFace(idx, sideCount)),
    [sideCount]
  );
  const handleFlip = useHoverClick(changeCardSide)();

  const rotateCard = useCallback(
    (state: HoverAction) =>
      setRotation(
        state === HoverAction.Leave
          ? undefined
          : state === HoverAction.Enter || state === HoverAction.FirstClick
            ? frontRotate
            : (dir) => (dir ? undefined : frontRotate)
      ),
    [frontRotate]
  );
  const handleRotate = useHoverClick(rotateCard)();

  // Pre-load images
  useEffect(() => {
    setImages(
      cardFaces
        .filter(({ img }, idx) => img && (!idx || img !== card.img))
        .map(({ uuid, img, name, faceName }, idx) => (
          <Image
            key={uuid}
            src={img as string}
            alt=""
            placeholder="empty"
            title={faceName || name}
            sizes={zoomLevelToWidth(zoomClass)}
            fill
            priority={!idx}
            unoptimized={!serverSideImageOptimize}
            onLoad={idx ? undefined : onLoad}
          />
        ))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardFaces]);

  return {
    images,
    cardFaces,
    direction,
    handleFlip,
    handleRotate,
    sideIdx,
    sideCount,
    showBadge: card.layout === "meld" && !card.otherFaces[0]?.backImg,
    reversed: isReversible(card) ? !!sideIdx : undefined,
    showFlip: showFlipButton(card, showImages),
    isRotater: !!frontRotate,
  };
}
