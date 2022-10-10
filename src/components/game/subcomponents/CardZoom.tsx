import { useEffect } from "react"
import RangeInput from "components/base/common/RangeInput"
import cardZoomLevels from "../styles/cardZoomLevels"
import { useLocalStorage } from "components/base/services/storage.services"

type Props = { updateClass: (className: string) => void }

export default function CardZoom({ updateClass }: Props) {
  const [ index, setIndex ] = useLocalStorage<number>('zoom')
  useEffect(() => { updateClass(cardZoomLevels[index]) }, [index])

  return (
    <RangeInput aria-label="Card size" value={index} setValue={(v) => setIndex(+v)} min={0} max={cardZoomLevels.length - 1} />
  )
}