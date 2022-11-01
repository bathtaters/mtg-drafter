import type { ReactNode } from "react"
import type { BoardLands } from "types/definitions"
import { CardCounter, ContainerHeaderStyle, CounterContainerStyle, LandCounterStyle } from "../styles/CardContainerStyles"
import { colorClass, colorPip } from "components/base/styles/manaIcons"
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
      <span>{label}{<CardCounter count={count} />}</span>
      <CounterContainerStyle>{ lands && colorOrder.map((c) => <LandCounter color={c} count={lands[c]} />)}</CounterContainerStyle>
    </ContainerHeaderStyle>
  )
}