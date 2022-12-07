type Props = { caption?: string, className?: string }

export default function Spinner({ caption = "", className = "text-secondary-focus" }: Props) {
  return (
    <div className="flex justify-center items-center flex-grow">
      <div className={`loading bg-transparent btn border-0 flex-col gap-4 ${className}`} role="status">
        <span>{caption}</span>
      </div>
    </div>
  )
}