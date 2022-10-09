import { useEffect, useState } from "react"
import RangeInput from "components/base/common/RangeInput"
import cardZoomLevels from "../styles/cardZoomLevels"
import { getLocalVar, setLocalVar } from "components/base/services/storage.services"

type Props = { updateClass: (className: string) => void }

export default function CardZoom({ updateClass }: Props) {
  const [ index, setIndex ] = useState(`${getLocalVar('zoom')}`)
  useEffect(() => {
    updateClass(cardZoomLevels[+index])
    setLocalVar('zoom', index)
  }, [index, updateClass])

  return (
    <RangeInput aria-label="Card size" value={index} setValue={setIndex} min={0} max={cardZoomLevels.length - 1} />
  )
}