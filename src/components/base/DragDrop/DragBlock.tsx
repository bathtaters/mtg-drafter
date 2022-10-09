import type { BorderClasses, BgClasses, OtherClasses } from './services/dragDrop.custom'
import type { Identifier, DropHandler, DropTester } from './services/dragBlock.controller';
import { useMemo, ReactNode } from "react";
import useDndController from './services/dragBlock.controller';
import dragClassController, { getClasses } from './services/dragClass.services';


export default function DragBlock<DropItem, ThisItem>({
  item,
  type = "text/json",
  onDrop = () => {},
  dropCheck = () => true,
  className = "",
  additionalClasses = {},
  borderClass = {},
  bgClass = {},
  draggable = true, droppable = true, disabled = false,
  children, 
}: Props<ThisItem>) {

  // Build memoized classes
  const classes = useMemo(() => 
    dragClassController(borderClass, bgClass, additionalClasses, droppable, draggable),
    [borderClass, bgClass, additionalClasses, droppable, draggable]
  );

  // Setup Drag & Drop backend
  const { disable, isOver, canDrop, ref } = useDndController<DropItem, ThisItem>(type, item, onDrop, dropCheck, droppable, draggable, disabled)
  
  // Render Draggable tag
  return (
    <div ref={ref} className={getClasses(className, classes, disable, isOver, canDrop)}>
      {children}
    </div>
  );
}

export type { Identifier, DropHandler, DropTester, BgClasses, BorderClasses, OtherClasses }

type Props<ThisItem> = {
  type?: Identifier,
  item: ThisItem,
  onDrop?: DropHandler,
  dropCheck?: DropTester,
  className?: string,
  additionalClasses?: Partial<OtherClasses>,
  borderClass?: Partial<BorderClasses>,
  bgClass?: Partial<BgClasses>,
  draggable?: boolean, droppable?: boolean, disabled?: boolean,
  children?: ReactNode
}