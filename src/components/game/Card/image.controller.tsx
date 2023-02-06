import type { CardFull, Direction } from "types/game"
import Image from "next/image"
import { useState, useEffect, useCallback, ReactNode, useMemo } from "react"
import { showFlipButton, getNextFace, isReversible } from "./RenderedCard/card.services"
import { HoverAction, useHoverClick } from "components/base/libs/hooks"
import { layoutDirection, serverSideImageOptimize } from "assets/constants"
import { matchWidth } from "../CardToolbar/cardZoomLevels"

const zoomLevelToWidth = (zoomClass: string) => {
  const w = zoomClass.match(matchWidth)?.[1]
  return w ? w + 'rem' : '100vw'
}

export default function useCardImage(card: CardFull, zoomClass: string, showImages = true, onLoad?: () => Promise<void> | void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cardFaces = useMemo(() => [card, ...card.otherFaces.map(({ card }) => card)], [card.uuid])
  const sideCount = cardFaces.length

  const [ images, setImages ] = useState([] as ReactNode[])
  const [ sideIdx, setSideIdx ] = useState(sideCount > 1 ? 0 : -1)

  const direction: Direction | undefined = sideIdx === 1 && sideCount === 2 ? layoutDirection[card.layout || 'normal'] : undefined

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSideChange = useCallback(
    sideCount < 3 ?
      // Normal action
      (state: HoverAction) => setSideIdx(
        state < HoverAction.Click ? state :
        state === HoverAction.FirstClick ? 1 :
          (idx) => getNextFace(idx, sideCount)
      )
    :
      // 3+ Faced Card
      (state: HoverAction) => state !== HoverAction.Leave && 
        setSideIdx((idx) => getNextFace(idx, sideCount)),
    [sideCount]
  )
  const handleFlip = useHoverClick(handleSideChange)()

  // Pre-load images
  useEffect(() => {
    setImages(cardFaces
      .filter(({ img }, idx) => img && (!idx || img !== card.img))
      .map(({ uuid, img, name, faceName }, idx) => (
        <Image key={uuid} src={img as string}
          alt="" placeholder="empty" title={faceName || name}
          sizes={zoomLevelToWidth(zoomClass)}
          fill priority={!idx} unoptimized={!serverSideImageOptimize}
          onLoadingComplete={idx ? undefined : onLoad}
        />
      ))
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardFaces])

  return {
    images, cardFaces, handleFlip, direction,
    sideIdx, sideCount,
    reversed: isReversible(card) ? !!sideIdx : undefined,
    showFlip: showFlipButton(card, showImages),
  }
}