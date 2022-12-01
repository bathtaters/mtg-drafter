import type { MouseEventHandler } from "react"
import type { BoardLands, ColorLower } from "types/game"
import type { ContainerType } from "../Card/Card"
import { CardCounter, ContainerHeaderStyle, containerIcon, ContainerLabelStyle, LandButton, LandContainerStyle, LandCounterStyle } from "./CardContainerStyles"
import { colorClass, colorPip, hoverClass } from "components/base/styles/manaIcons"
import { colorOrder } from "assets/constants"
import { cardCounter } from "assets/strings"
import { getObjectSum } from "components/base/services/common.services"

const LandCounter = ({ color, count }: { color: ColorLower, count: number }) => !count ? null : (
  <LandCounterStyle className={`${colorClass[color]} ${hoverClass[color]} border-solid border-1`}>
    <span className={colorPip[color]} />
    <span>{count}</span>
  </LandCounterStyle>
)

export default function ContainerHeader({ label, count, lands, onLandClick }: { label: ContainerType, count?: number, lands?: BoardLands, onLandClick?: MouseEventHandler }) {
  return (
    <ContainerHeaderStyle>
      <ContainerLabelStyle>{containerIcon[label]}{label}{<CardCounter text={cardCounter(count, lands)} />}</ContainerLabelStyle>
      <LandContainerStyle onClick={onLandClick}>
        { lands && colorOrder.map((c) => <LandCounter key={c} color={c} count={lands[c]} />)}
        { lands && !getObjectSum(lands) && <LandButton />}
      </LandContainerStyle>
    </ContainerHeaderStyle>
  )
}