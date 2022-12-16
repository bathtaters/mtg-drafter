import type { ChangeEvent, ChangeEventHandler, HTMLProps } from "react"

export default function NumberInput(props: HTMLProps<HTMLInputElement>) {
  return (
    <input type="number" pattern="[0-9]*" inputMode="decimal" formNoValidate onFocus={(ev) => ev.target.select()} {...props} />
  )
}

export type NumberInputProps = HTMLProps<HTMLInputElement>


// export interface NumberInputProps extends Omit<HTMLProps<HTMLInputElement>, "min"|"max"|"value"|"onChange"> {
//   min?: number, max?: number, value: number,
//   onChange: (value: number) => void,
//   wrapperClass?: string, buttonClass?: string,
// }


// export default function NumberInput({ wrapperClass, buttonClass, ...inputProps }: NumberInputProps) {
//   const { decHandler, incHandler, changeHandler, invalidHandler } = useNumberPicker(inputProps)

//   return (
//     <div className={`input-group ${wrapperClass}`}>
//       <input type="button" value="－" data-action="decrement" className={`btn btn-ghost btn-sm sm:btn-md ${buttonClass}`} onClick={decHandler} />
//       <input type="number" inputMode="decimal" pattern="\\d*" formNoValidate {...inputProps} onChange={changeHandler} onInvalid={invalidHandler} />
//       <input type="button" value="＋" data-action="increment" className={`btn btn-ghost btn-sm sm:btn-md ${buttonClass}`} onClick={incHandler} />
//     </div>
//   )
// }


// -- Controller -- \\

// Prevent tooltip when value is outside of min/max limit
// const invalidHandler: ChangeEventHandler<HTMLInputElement> = (ev) => ev.currentTarget.value.length && ev.preventDefault()

// const useNumberPicker = ({ value, onChange, min, max }: NumberInputProps) => ({
  
//   invalidHandler,

//   changeHandler: (ev: ChangeEvent<HTMLInputElement>) => {
//     ev.currentTarget.value && onChange(+ev.currentTarget.value)
//   },

//   decHandler: () => {
//     if (value === min) return;
//     if      (typeof min === 'number' && value < min) onChange(min)
//     else if (typeof max === 'number' && value > max) onChange(max)
//     else onChange(value - 1)
//   },

//   incHandler: () => {
//     if (value === max) return;
//     if      (typeof max === 'number' && value > max) onChange(max)
//     else if (typeof min === 'number' && value < min) onChange(min)
//     else onChange(value + 1)
//   }

// })