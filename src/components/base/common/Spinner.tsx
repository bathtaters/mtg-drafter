type Props = { caption?: string, className?: string }

export default function Spinner({ caption = "", className = "text-secondary text-xl bg-secondary-content/75 rounded-lg p-8 min-w-60" }: Props) {
  return (
    <div className="flex justify-center items-center flex-grow">
      <div className={`flex justify-center items-end ${className}`} role="status">
        <span>{caption}</span>
        <span className="loading loading-dots loading-sm" />
      </div>
    </div>
  )
}