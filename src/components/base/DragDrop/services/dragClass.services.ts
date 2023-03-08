// Logic for maniplulating classes
import { extractMatches } from "./dragDrop.utils"
import { COMMON_CLS, classDefault, optimizeClassSwapping } from "./dragDrop.custom"
import { BorderClasses, BgClasses, OtherClasses, ClassObjectStr, ClassPrefix } from "./dragDrop.custom"

// Get class names to use based on state
export const getClasses = (className: string, classes: ClassObjectStr, disabled: boolean, isOver: boolean, canDrop: boolean) => 
  `${className} ${classes[COMMON_CLS]} ${
    disabled ? classes.disabled :
    !isOver  ? classes.enabled  :
    canDrop  ? classes.drop     : classes.illegal
  }`


// Combine custom classes w/ defaults
function getDefaultClasses(customBorder: Partial<BorderClasses>, customBgd: Partial<BgClasses>, additional: Partial<OtherClasses>) {
  const border  = Object.assign({}, classDefault.border, customBorder) as BorderClasses
  const bg      = Object.assign({}, classDefault.bg,     customBgd) as BgClasses
  const other   = Object.assign({}, classDefault.additional);
  
  // Add in additional classes
  Object.keys(additional).forEach((c) => { 
    if (!other[c]) return;
    else if (typeof additional[c] === 'string') other[c].push(additional[c] as string)
    else if (Array.isArray(additional[c]))      other[c].push(...(additional[c] as string[]))
  })

  return { border, bg, ...other }
}


// Get class array from UI class objects
function toClassArray(base: Record<string,string>, type: ClassPrefix = 'base', isBorder?: boolean) {
  // Set defaults
  return [
    base[type+'Color'] || base.baseColor,
    isBorder && (base[type+'Style']  || base.baseStyle),
    isBorder && (base[type+'Weight'] || base.baseWeight),
  ].filter(Boolean) as string[]
}

// Get class data
export default function dragClassController(border: Partial<BorderClasses>, bgd: Partial<BgClasses>, other: Partial<OtherClasses>, droppable: boolean, draggable: boolean) {
  // Get default classes
  const rawClasses = getDefaultClasses(border, bgd, other);

  // Build Class arrays
  const classes = {
    enabled:  rawClasses.enabled
      .concat(toClassArray(rawClasses.border, 'base', true))
      .concat(toClassArray(rawClasses.bg))
      .concat(draggable ? rawClasses.drag : []),

    disabled:  rawClasses.disabled
      .concat(toClassArray(rawClasses.border, 'disabled', true))
      .concat(toClassArray(rawClasses.bg,     'disabled')),
      
    drop:     !droppable ? [] : rawClasses.drop
      .concat(toClassArray(rawClasses.border, 'drop', true))
      .concat(toClassArray(rawClasses.bg,     'hover')),
      
    illegal:  !droppable ? [] : rawClasses.illegal
      .concat(toClassArray(rawClasses.border, 'illegal', true))
      .concat(toClassArray(rawClasses.bg,     'illegal')),
  }

  // Move matching classes to 'common' class array to optimize class swapping (& convert to strings)
  return extractMatches(classes, optimizeClassSwapping)
}