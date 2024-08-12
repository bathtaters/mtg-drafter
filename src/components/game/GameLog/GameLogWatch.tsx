import type { Game } from "types/game"
import type { Props as LogProps } from "./GameLog"
import type { SetNumber } from "./logWatch.controller"
import GameLog from "./GameLog"
import PasswordForm from "components/base/common/FormElements/PasswordForm"
import { GameLogWatchWrapper, ErrorContainer } from "./LogStyles"
import useLogWatch from "./logWatch.controller"

type Props = LogProps & {
    game?: Partial<Game>,
    setLoading?: SetNumber,
}

export default function GameLogPage({ game, setLoading, ...props }: Props) {
    const { authed, message, handleSubmit } = useLogWatch(game, props.log.refresh, setLoading)

    return (
        <GameLogWatchWrapper title="Live Game Watcher">{
            !game?.logKey ? <ErrorContainer text="Observing this game has been disabled by the host." /> :
            !authed ? <PasswordForm label="Enter Password" message={message} onSubmit={handleSubmit} fullPage={true} /> : 
            <GameLog {...props} />
        }</GameLogWatchWrapper>
    )
}
