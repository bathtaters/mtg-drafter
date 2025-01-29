export function BanIcon({ className = '' }: { className?: string }) {
  return <div className={`leading-none ${className}`}>⊘</div>
}

export function UnbanIcon({ className = '' }: { className?: string }) {
  return <div className={`leading-none ${className}`}>✓</div> // ✕  ✓ ✔
}