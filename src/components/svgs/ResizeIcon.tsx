/* Original art by bathtaters -- CC0 */
export default function ResizeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 240" className={className}>
      <g fill="none" strokeWidth="8">
        <rect rx="4" height="230" width="150" y="5" x="10" stroke-dasharray="17,10" />
        <rect rx="4" height="115" width="75" y="120" x="10"/>
      </g>
      <path stroke="none" d="m85.28741,124.23132l51.78759,-51.78759l0.00023,22.48034
        c-0.00023,2.66591 2.16117,4.82731 4.82731,4.82731c1.33261,0 2.53961,-0.54024 3.41323,-1.41385
        s1.41385,-2.08062 1.41363,-3.41346l0,-34.13456c0.00023,-2.66591 -2.16117,-4.82731 -4.82731,-4.82731l-34.13456,0
        c-2.66568,0 -4.82708,2.1614 -4.82731,4.82731c-0.00023,2.66591 2.16117,4.82731 4.82731,4.82731l22.48057,0l-51.78759,51.78759l6.82691,6.82691z" />
    </svg>
  )
}
