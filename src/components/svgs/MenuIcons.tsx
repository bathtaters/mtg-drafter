import GearIcon from "./GearIcon"

/* Copied from SVG Repo -- Public Domain: https://www.svgrepo.com/svg/361778/export */
export const ExportIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M11.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L13 5.414V16a1 1 0 1 1-2 0
      V5.414L8.707 7.707a1 1 0 0 1-1.414-1.414l4-4zM5 17a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v2a2 2 0 0 1-2 2
      H6a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" />
  </svg>
)

export const LandIcon = ({ className = "" }: { className?: string }) => (
  <span className={`text-xl fill-current ms ms-land mx-px ${className}`} />
)

/* Remixed from SVG Repo -- Public Domain: https://www.svgrepo.com/svg/358694/edit-rename */
export const RenameIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 fill-current ${className}`} viewBox="0 0 512 488">
    <g>
      <path d="M 0 96 L 0 128 L 0 320 L 0 352 L 320 352 L 320 320 L 32 320 L 32 128 L 320 128 L 320 96 L 32 96 L 0 96 z" />
      <path d="M 416 96 L 416 128 L 480 128 L 480 320 L 416 320 L 416 352 L 512 352 L 512 320 L 512 128 L 512 96 L 480 96 L 416 96 z" />
      <rect y="32"  x="352" height="384" width="32" />
      <rect y="416" x="384" height="32"  width="64"   />
      <rect y="416" x="288" height="32"  width="64"   />
      <rect y="0"   x="384" height="32"  width="64"   />
      <rect y="0"   x="288" height="32"  width="64"   />
      <rect y="160" x="64"  height="128" width="224"  />
    </g>
  </svg>
)

export const ToolsIcon = ({ className = "" }: { className?: string }) => <GearIcon className={`w-6 h-6 fill-current ${className}`} />

/* Copied from SVG Repo -- Public Domain: https://www.svgrepo.com/svg/240195/exit */
export const ExitIcon = ({ className = "" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 fill-current ${className}`} viewBox="0 0 512 512">
    <path d="M510.371,226.513c-1.088-2.603-2.645-4.971-4.629-6.955l-63.979-63.979c-8.341-8.32-21.824-8.32-30.165,0
      c-8.341,8.341-8.341,21.845,0,30.165l27.584,27.584H320.013c-11.797,0-21.333,9.557-21.333,21.333s9.536,21.333,21.333,21.333
      h119.168l-27.584,27.584c-8.341,8.341-8.341,21.845,0,30.165c4.16,4.181,9.621,6.251,15.083,6.251s10.923-2.069,15.083-6.251
      l63.979-63.979c1.984-1.963,3.541-4.331,4.629-6.955C512.525,237.606,512.525,231.718,510.371,226.513z" />
    <path d="M362.68,298.667c-11.797,0-21.333,9.557-21.333,21.333v106.667h-85.333V85.333c0-9.408-6.187-17.728-15.211-20.437
      l-74.091-22.229h174.635v106.667c0,11.776,9.536,21.333,21.333,21.333s21.333-9.557,21.333-21.333v-128
      C384.013,9.557,374.477,0,362.68,0H21.347c-0.768,0-1.451,0.32-2.197,0.405c-1.003,0.107-1.92,0.277-2.88,0.512
      c-2.24,0.576-4.267,1.451-6.165,2.645c-0.469,0.299-1.045,0.32-1.493,0.661C8.44,4.352,8.376,4.587,8.205,4.715
      C5.88,6.549,3.939,8.789,2.531,11.456c-0.299,0.576-0.363,1.195-0.597,1.792c-0.683,1.621-1.429,3.2-1.685,4.992
      c-0.107,0.64,0.085,1.237,0.064,1.856c-0.021,0.427-0.299,0.811-0.299,1.237V448c0,10.176,7.189,18.923,17.152,20.907
      l213.333,42.667c1.387,0.299,2.795,0.427,4.181,0.427c4.885,0,9.685-1.685,13.525-4.843c4.928-4.053,7.808-10.091,7.808-16.491
      v-21.333H362.68c11.797,0,21.333-9.557,21.333-21.333V320C384.013,308.224,374.477,298.667,362.68,298.667z" />
  </svg>
)
