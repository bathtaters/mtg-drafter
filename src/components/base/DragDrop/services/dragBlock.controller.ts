import { useState } from "react"
import { useDrag, useDrop, ConnectableElement } from "react-dnd"

function useDndController<DropItem, ThisItem>(type: Identifier, item: ThisItem | undefined, onDrop: DropHandler, dropCheck: DropTester, droppable: boolean, draggable: boolean, disabled: boolean) {
  // Simple data
  const disable = disabled || (!draggable && !droppable)
  const flatItem = JSON.stringify(item)

  const [canDrop, setCanDrop] = useState(false)

  // Setup drag/drop backend
  const [, drag] = useDrag(() => ({
    type, item,
    canDrag: () => !disable && draggable
  }), [type, draggable, disable, flatItem])

  const [{ isOver }, drop] = useDrop(() => ({
    accept: type,
    canDrop: (dropped: DropItem, monitor) => {
      const cd: boolean | null = !disable && droppable && dropCheck(monitor.getItemType(), dropped, item)
      cd != null && setCanDrop(cd)
      return cd || false
    },
    drop: (dropped: DropItem, monitor) => monitor.didDrop() || onDrop(dropped, item),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    })
  }), [type, droppable, disable, flatItem, onDrop, dropCheck])

  return {
    disable, isOver, canDrop,
    ref: (node: ConnectableElement) => disable ? node : drag(drop(node)),
  }
}

export default useDndController

export type Identifier  = string | symbol
export type DropHandler = <DropItem, ThisItem>(droppedItem: DropItem, thisItem: ThisItem) => void
export type DropTester  = <DropItem, ThisItem>(type: Identifier | null, droppedItem: DropItem, thisItem: ThisItem) => boolean | null