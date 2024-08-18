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
    sessionId?: string,
}

export default function GameLogWatch({ game, sessionId, setLoading, ...props }: Props) {
    const { authed, message, handleSubmit, logout } = useLogWatch(props.log, game, props.players, sessionId, setLoading)

    return (
        <GameLogWatchWrapper title="Live Draft View">{
            !game?.watchKey ? <ErrorContainer text="Observing this game has been disabled by the host." /> :
            !authed ? <PasswordForm label="Enter Password" message={message} onSubmit={handleSubmit} fullPage={true} /> : 
            <GameLog {...props} logout={logout} />
        }</GameLogWatchWrapper>
    )
}
