import type { MouseEventHandler, ReactNode } from "react"
import ModalWrapper from "components/base/common/Modal"
import { ModalButton, ColorsWrapper, ColorInputWrapper, ColorLabels, ColorInput, AutoLandsWrapper, AutoLandsInput } from "../styles/GameMenuStyles"
import { colorOrder } from "assets/constants"
import useLandsModal, { LandsModalProps } from "../services/lands.controller"


export default function LandsModal(props: LandsModalProps) {
  const { localLands, landSums, landChange, handleSave, handleCancel, autoLandsProps } = useLandsModal(props)

  return (
    <ModalWrapper isOpen={props.isOpen} title="Set Basic Lands" className="md:max-w-3xl"
      buttons={<>
        <AutoLandsButton {...autoLandsProps}>Auto</AutoLandsButton>
        <ModalButton onClick={handleSave} className="btn-primary">Save</ModalButton>
        <ModalButton onClick={handleCancel}>Cancel</ModalButton>
      </>}
    >
      <ColorsWrapper>
        <ColorLabels labels={['','Main','Side']} className="text-2xl items-end font-bold font-serif" />

        {(colorOrder).map((color) =>
          <ColorColumn label={color} key={color}
            main={localLands.main[color]} setMain={landChange('main',color)}
            side={localLands.side[color]} setSide={landChange('side',color)}
          />)
        }
        <ColorLabels labels={landSums} className="italic font-sans items-start" />
      </ColorsWrapper>

    </ModalWrapper>
  )
}


type ColorProps = { label: string, main: number, setMain: NumSet, side: number, setSide: NumSet }

const ColorColumn = ({ label, main, setMain, side, setSide }: ColorProps) => (
  <ColorInputWrapper label={label}>
    <ColorInput value={main} setValue={setMain} />
    <ColorInput value={side} setValue={setSide} />
  </ColorInputWrapper>
)


type LandsProps = {
  onClick: MouseEventHandler, children: ReactNode,
  deckSize: number, setDeckSize: NumSet,
  sideLands: number, setSideLands: NumSet,
}

const AutoLandsButton = ({ onClick, deckSize, setDeckSize, sideLands, setSideLands, children }: LandsProps) => (
  <AutoLandsWrapper button={<ModalButton className="btn-accent" onClick={onClick}>{children}</ModalButton>}>
    <AutoLandsInput label="Deck size" value={deckSize}  onChange={(ev) =>  setDeckSize(+ev.currentTarget.value)} min="1" max="500" />
    <AutoLandsInput label="Sideboard" value={sideLands} onChange={(ev) => setSideLands(+ev.currentTarget.value)} min="0" max="50" />
  </AutoLandsWrapper>
)


type NumSet = (value: number) => void