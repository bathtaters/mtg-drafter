export default function CardIcon({ innerIcon, className }: { innerIcon?: "X"|"gear", className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 160" className={className}>
      <rect className="stroke-current" strokeWidth="6" x="5" y="5" width="115" height="150" rx="10"/>
      { innerIcon === 'X' ?
        <path className="fill-current" d="m37.39822,40.82525l-14.07297,14.07297l7.1862,7.1862l17.76587,18.0653l-17.76587,17.76587l-7.1862,6.88677
          l14.07297,14.37239l7.1862,-7.1862l18.0653,-18.0653l17.76587,18.0653l6.88677,7.1862l14.37239,-14.37239l-7.1862,-6.88677l-18.0653,-17.76587
          l18.0653,-18.0653l7.1862,-7.1862l-14.37239,-14.07297l-6.88677,7.1862l-17.76587,17.76587l-18.0653,-17.76587l-7.1862,-7.1862z"
        />
        
        : innerIcon === 'gear' ?
        <path className="fill-current" d="m26.42835,85.95295l5.16458,0.03218c0.77227,3.97399 2.30073,7.83537 4.61756,11.34278l-3.6683,3.63612
          c-1.3193,1.30321 -1.3193,3.41088 -0.03218,4.73018l3.95791,4.00617c1.30321,1.3193 3.41088,1.3193 4.73018,0.03218l3.6683,-3.63612
          c3.47523,2.349 7.32052,3.94182 11.29451,4.74627l-0.03218,5.16458c-0.01609,1.85024 1.48019,3.34652 3.33043,3.36261l5.63117,0.03218
          c1.85024,0.01609 3.34652,-1.48019 3.36261,-3.33043l0.03218,-5.16458c3.97399,-0.77227 7.83537,-2.30073 11.34278,-4.61756l3.63612,3.6683
          c1.30321,1.3193 3.41088,1.3193 4.73018,0.03218l4.00617,-3.95791c1.3193,-1.30321 1.3193,-3.41088 0.03218,-4.73018l-3.63612,-3.6683
          c2.349,-3.47523 3.94182,-7.32052 4.74627,-11.29451l5.16458,0.03218c1.85024,0.01609 3.34652,-1.48019 3.36261,-3.33043l0.03218,-5.63117
          c0.01609,-1.85024 -1.48019,-3.34652 -3.33043,-3.36261l-5.16458,-0.03218c-0.77227,-3.97399 -2.30073,-7.83537 -4.61756,-11.34278l3.6683,-3.63612
          c1.3193,-1.30321 1.3193,-3.41088 0.03218,-4.73018l-3.95791,-4.00617c-1.30321,-1.3193 -3.41088,-1.3193 -4.73018,-0.03218l-3.6683,3.63612
          c-3.47523,-2.349 -7.32052,-3.94182 -11.29451,-4.74627l0.03218,-5.16458c0.01609,-1.85024 -1.48019,-3.34652 -3.33043,-3.36261l-5.63117,-0.03218
          c-1.85024,-0.01609 -3.34652,1.48019 -3.36261,3.33043l-0.04827,5.16458c-3.99008,0.77227 -7.85146,2.30073 -11.34278,4.61756l-3.63612,-3.6683
          c-1.30321,-1.3193 -3.41088,-1.3193 -4.73018,-0.03218l-3.99008,3.95791c-1.3193,1.30321 -1.3193,3.41088 -0.03218,4.73018l3.63612,3.6683
          c-2.349,3.47523 -3.94182,7.32052 -4.74627,11.29451l-5.16458,-0.03218c-1.85024,-0.01609 -3.34652,1.48019 -3.36261,3.33043l-0.03218,5.63117
          c-0.01609,1.83415 1.48019,3.34652 3.33043,3.36261z
          m25.51723,-16.61999c5.88859,-5.82424 15.36504,-5.77597 21.18928,0.11262s5.77597,15.36504 -0.11262,21.18928s-15.36504,5.77597 -21.18928,-0.11262s-5.77597,-15.36504 0.11262,-21.18928z"
        />

        : null
      }
    </svg>
  )
}
