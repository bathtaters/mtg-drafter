import PlayerMenu from "./PlayerMenu";
import { Player } from "../../../models/Game";

const specColor = {
  self: [
    'bg-primary-content',
    'text-primary',
    'text-primary-focus'
  ],
  opp: [
    'bg-accent-content',
    'text-accent',
    'text-accent-focus'
  ]
}

export const PlayerContainerSmall = ({ player, spec, isHost }: { player: Player, spec?: "self"|"opp", isHost: boolean }) => (
  <div className="stats rounded-lg shadow-sm shadow-black">
    <div className={`stat py-0 px-2 ${spec ? specColor[spec][0] : ''}`}>
      <div className={`stat-figure flex flex-col justify-center opacity-60 ${spec ? specColor[spec][2] : ''}`}>
        <div className="text-xs">Pick {player.pick || '-'}</div>
        <div className="text-2xs">Holding {'X'}</div>
      </div>
      <div className={`stat-value row-span-3 self-center text-base ${spec ? specColor[spec][1] : ''}`}>
        {isHost && <span className="w-0 -ml-1 text-2xs align-middle opacity-60">•</span>}
        <span className={player.sessionId ? '' : "opacity-60 italic"}>{player.name}</span>
      </div>
    </div>
  </div>
)


export const PlayerContainerFull = ({ player, isHost }: { player: Player, isHost: boolean }) => (
  <div className="stats col-span-2 overflow-visible">
    <div className="stat bg-primary-content rounded-2xl">
      <div className="stat-figure -mr-3 sm:mr-0"><PlayerMenu player={player} isHost={isHost} /></div>
      <div className="stat-title text-xs sm:text-base">Player{isHost ? ' (Host)' : ''}</div>
      <div className="stat-value text-primary flex items-center">
        {isHost && <span className="w-2 -ml-2 pr-2 text-xs align-middle opacity-60">•</span>}
        <span className="text-lg sm:text-2xl">{player.name}</span>
      </div>
      <div className="stat-desc text-primary-focus">
        Pick {player.pick || '-'} | Holding {'X'}
      </div>
    </div>
  </div>
)