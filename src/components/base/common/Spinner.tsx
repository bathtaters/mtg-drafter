type Props = { caption?: string, className?: string, hideWrapper?: boolean }

export default function Spinner({
  caption = "",
  className = "text-secondary bg-secondary-content/75 rounded-lg p-8 min-w-60",
  hideWrapper = false,
}: Props) {
  const innerHtml = (
      <div className={`flex justify-center items-end text-xl font-light ${className}`} role="status">
        <span>{caption}</span>
        <span className="loading loading-dots loading-sm" />
      </div>
  )
  return hideWrapper ?
    innerHtml :
    <div className="flex justify-center items-center flex-grow">{innerHtml}</div>
}