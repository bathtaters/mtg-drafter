import type { ReactNode } from "react"
import type { BoardLands } from "types/definitions"
import { CardCounter, ContainerHeaderStyle, ContainerLabelStyle, LandContainerStyle, LandCounterStyle } from "../styles/CardContainerStyles"
import { colorClass, colorPip } from "components/base/styles/manaIcons"
import { getObjectSum } from "components/base/services/common.services"
import { colorOrder } from "assets/constants"

const LandCounter = ({ color, count }: { color: string, count: number }) => !count ? null : (
  <LandCounterStyle className={colorClass[color]}>
    <span className={colorPip[color]} />
    <span>{count}</span>
  </LandCounterStyle>
)

export default function ContainerHeader({ label, count, lands }: { label: ReactNode, count?: number, lands?: BoardLands }) {
  return (
    <ContainerHeaderStyle>
      <ContainerLabelStyle>{label}{<CardCounter count={lands ? `${count} | ${getObjectSum(lands) + (count || 0)}` : `${count}`} />}</ContainerLabelStyle>
      <LandContainerStyle>{ lands && colorOrder.map((c) => <LandCounter color={c} count={lands[c]} />)}</LandContainerStyle>
    </ContainerHeaderStyle>
  )
}