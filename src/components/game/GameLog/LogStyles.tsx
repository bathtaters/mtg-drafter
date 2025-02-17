import type { Ref, MouseEventHandler, ReactNode } from "react"
import type { GameCardFull, GameCardPartial } from "types/game"
import Image from "next/image"
import Link from "next/link"
import Card from "../Card/Card"
import { IntersectionChildProps } from "components/base/libs/hooks"
import getColorClass from "components/base/libs/colors"
import { objToString } from "./log.utils"
import { scryfallLink } from "assets/urls"

export const GameLogWatchWrapper = ({ title, children }: { title: string, children: ReactNode }) => (
  <div className="relative pt-14 w-full h-full -top-6">
    <h2 className="absolute top-2 left-2 font-serif mb-6">{title}</h2>
    {children}
  </div>
)

export const LogContainer = ({ children, toolbar, ref }: { children: ReactNode, toolbar: ReactNode, ref?: Ref<HTMLElement> }) => (<>
  <div className="absolute top-4 right-4">{toolbar}</div>
  <div className="card w-full h-full bg-base-300 border border-base-content">
    <ul className="card-body overflow-y-auto py-4 px-6 min-h-full max-h-80" ref={ref as Ref<HTMLUListElement>}>
      {children}
    </ul>
  </div>
</>)

export const ErrorContainer = ({ text }: { text: string }) => <p className="opacity-80 italic">{text}</p>

export const EntryWrapper = ({ children, childProps }: { children: ReactNode, childProps?: IntersectionChildProps<any> }) => (
  <li className="flex flex-wrap items-center my-0.5 gap-y-0.5" {...childProps}>{children}</li>
)

export const EntryItem = (
  { tip, gameData, below, right, color, inv, children, onClick }:
  { tip?: string, gameData?: Record<string,any>, below?: boolean, right?: boolean, color?: number, inv?: boolean, children: ReactNode, onClick?: MouseEventHandler }
) => (
  <span data-tip={tip || objToString(gameData)} onClick={onClick}
    className={`text-left ${tip || gameData ? `tooltip tooltip-primary ${below ? 'tooltip-bottom' : 'tooltip-top'
      }${right ?' before:content-[attr(data-tip)] before:translate-x-0 before:left-0' : ''} ` : ''}${
      typeof color === 'number' ? `badge badge-lg truncate ${getColorClass(color, 'all', { inverse: inv })}` : ''
      }${onClick ? ' cursor-pointer badge badge-lg hover:badge-primary' : ''}`
  }>
    {children}
  </span>
)

const NoCard = ({ name, isLink }: { name?: string, isLink?: boolean }) => (<>
  <div>{name}</div>
  <div className="text-sm italic opacity-80">Image not found</div>
  {isLink && <div className="text-sm italic link link-hover link-primary">Click to open in Scryfall.</div>}
</>)

const CardLink = ({ card, alt }: { card: GameCardFull | GameCardPartial, alt?: string }) => !card ? null : (
  <Link
    title={alt} target="_blank" aria-disabled={!card.card.scryfallId}
    href={card.card.scryfallId ? scryfallLink(card.card.scryfallId) : ''}
    onClick={(ev) => ev.stopPropagation()}
  >
    {'text' in card.card ?
      <Card
        card={card.card} isFoil={card.foil}
        showImage={true}
        className="w-card h-card text-card"
        isSelected={false}
        isHighlighted={false}
        container="pack"
      />
      :
      <div className="modal-box w-card h-card rounded-card bg-base-300 flex flex-col justify-center items-center text-center gap-4">{
        card.card.img ?
          <Image src={card.card.img} alt={alt || card.card.name} className="w-full h-full" fill />
          :
          <NoCard name={card.card.name} isLink={!!card.card.scryfallId} />
      }</div>
    }
  </Link>
)

export const CardModal = ({ card, close, className, children }: { card?: GameCardFull | GameCardPartial, close: () => void, className?: string, children?: ReactNode }) => (
  <dialog className={`modal modal-middle${card ? ' modal-open' : ''} ${className ?? ''}`} onClick={close}>
    {card && <>
      <CardLink card={card} alt="Open in Scryfall" />
      <div className="absolute bottom-2 z-10 w-1/2" onClick={(ev) => ev.stopPropagation()}>
        {children}
      </div>
      <style jsx global>{"html,body,#__next { overflow-y: hidden; }"}</style>
    </>}
  </dialog>
)

export const MissingCard = () => <span className="italic opacity-50">Empty Pack</span>

export const EntrySpace = () => <span className="inline-block w-1"></span>

export const EntryLoading = ({ childProps }: { childProps?: IntersectionChildProps }) => (
  <EntryWrapper childProps={childProps}>
    <div className="skeleton bg-base-content/20 h-4 w-14" />
    <EntrySpace />
    <div className="skeleton bg-base-content/20 h-6 w-20" />
    <EntrySpace />
    <div className="skeleton bg-base-content/20 h-6 w-24" />
    <EntrySpace />
    <div className="skeleton bg-base-content/20 h-5 w-5 rounded-full" />
    <EntrySpace />
    <div className="skeleton bg-base-content/20 h-6 w-24" />
  </EntryWrapper>
)
