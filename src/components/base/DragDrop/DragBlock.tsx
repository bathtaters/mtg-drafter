import React, { MouseEventHandler, ReactNode, useMemo } from "react";
import { BorderClasses, BgClasses, OtherClasses } from './services/dragDrop.custom'
import dragClassController, { getClasses } from './services/dragClass.services';
import useDndController, { Identifier, DropHandler, DropTester } from './services/dragBlock.controller';


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
}:{
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
}) {

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