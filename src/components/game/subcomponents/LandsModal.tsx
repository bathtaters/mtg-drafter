import type { Dispatch, SetStateAction } from "react"
import type { BasicLands } from "types/definitions"
import { useState } from "react"
import ModalWrapper from "components/base/common/Modal"
import { ColorInputWrapper, ColorsWrapper } from "../styles/GameMenuStyles"
import { colorOrder } from "backend/utils/game/game.utils"


const ColorInput = ({ label, value, setValue }: InputProps) => (
  <ColorInputWrapper label={label}>
    <input
      className="input input-bordered text-xl"
      type="number" min={0} id={label+'Lands'}
      defaultValue={setValue ? undefined : value}
      value={setValue && value}
      onChange={setValue && ((ev) => setValue(+ev.target.value))}
    />
  </ColorInputWrapper>
)


export default function LandsModal({ basics, isOpen, setOpen, onSubmit = () => {} }: Props) {
  const [localLands, setLocalLands] = useState(basics)

  const handleSave   = () => { onSubmit && onSubmit(localLands); setOpen((st) => !st) }
  const handleCancel = () => { setLocalLands(basics);            setOpen((st) => !st) }

  const handleChange = (color: string) => (value: number) => setLocalLands((lands: BasicLands) => ({ ...lands, [color]: value }))

  return (
    <ModalWrapper isOpen={isOpen} title="Set Basic Lands"
      buttons={<>
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
        <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
      </>}
    >
      <ColorsWrapper>
        {(colorOrder).map((color) =>
          <ColorInput label={color} value={localLands[color]} setValue={handleChange(color)} key={color} />)
        }
      </ColorsWrapper>

    </ModalWrapper>
  )
}


type InputProps = { label: string, value: number, setValue?: (value: number) => void }

type Props = {
  basics: BasicLands,
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onSubmit?: (basics: BasicLands) => void
}