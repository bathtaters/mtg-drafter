import type { MouseEventHandler, ReactNode } from "react"
import type { Color, TabLabels } from "@prisma/client"
import type { BoardLands } from "types/game"
import { CardCounter, ContainerHeaderStyle, ContainerLabelStyle, LandButton, LandContainerStyle, LandCounterStyle } from "./CardContainerStyles"
import { colorClass, colorPip, hoverClass } from "components/base/styles/manaIcons"
import { colorOrder } from "assets/constants"
import { cardCounter } from "assets/strings"
import { getObjectSum, titleCase } from "components/base/services/common.services"
import { containerIcon } from "../GameBody/GameLayoutStyles"

const LandCounter = ({ color, count }: { color: Lowercase<Color>, count: number }) => !count ? null : (
  <LandCounterStyle className={`${colorClass[color]} ${hoverClass[color]} border-solid border-1`}>
    <span className={colorPip[color]} />
    <span>{count}</span>
  </LandCounterStyle>
)

export default function ContainerHeader({ label, count, children = <div />, lands, onLandClick }: { label: TabLabels, count?: number, children?: ReactNode, lands?: BoardLands, onLandClick?: MouseEventHandler }) {
  return (
    <ContainerHeaderStyle>
      <ContainerLabelStyle>{containerIcon[label]}{titleCase(label)}{<CardCounter text={cardCounter(count, lands)} />}</ContainerLabelStyle>
      {children}
      <LandContainerStyle onClick={onLandClick}>
        { !lands ? "" : !getObjectSum(lands) ? <LandButton /> :
            colorOrder.map((c) => <LandCounter key={c} color={c} count={lands[c]} />)
        }
      </LandContainerStyle>
    </ContainerHeaderStyle>
  )
}