import { Dispatch, SetStateAction, useState } from "react";
import { Player } from "../../../models/Game";
import ModalWrapper from "../../base/common/Modal";
import { ColorInputWrapper, ColorsWrapper } from "../styles/GameMenuStyles";


const ColorInput = ({ label, value, setValue }: { label: string, value: number, setValue?: (value: number) => void }) => (
  <ColorInputWrapper label={label}>
    <input
      className="input input-bordered"
      type="number" min={0} id={label+'Lands'}
      defaultValue={setValue ? undefined : value}
      value={setValue && value}
      onChange={setValue && ((ev) => setValue(+ev.target.value))}
    />
  </ColorInputWrapper>
)


export default function LandsModal({ basicLands, isOpen, setOpen, onSubmit = () => {} }: {
  basicLands: Player['basicLands'],
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
  onSubmit?: (basicLands: Player['basicLands']) => void
}) {
  const [localLands, setLocalLands] = useState(basicLands)

  const handleSave = () => { onSubmit && onSubmit(localLands); setOpen((st) => !st) }

  const handleChange = (color: string) => (value: number) => setLocalLands((lands) => ({ ...lands, [color]: value }))

  return (
    <ModalWrapper isOpen={isOpen} title="Add Lands"
      buttons={<>
        <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
        <button type="button" className="btn" onClick={() => setOpen((st) => !st)}>Cancel</button>
      </>}
    >
      <ColorsWrapper>
        {Object.keys(basicLands).map((color) =>
          <ColorInput label={color} value={localLands[color]} setValue={handleChange(color)} key={color} />)
        }
      </ColorsWrapper>

    </ModalWrapper>
  )
}