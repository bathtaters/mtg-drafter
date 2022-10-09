type Props = { className?: string }

export default function Spinner({ className = "w-8 h-8 border-4 border-base-content" }: Props) {
  return (
    <div className="flex justify-center items-center flex-grow">
      <div className="btn loading bg-transparent border-0 text-secondary-focus" role="status">
        <span className="hidden">Loading...</span>
      </div>
    </div>
  )
}