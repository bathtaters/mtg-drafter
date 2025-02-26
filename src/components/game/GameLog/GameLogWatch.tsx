import type { LogWatchHook } from "./logWatch.controller"
import GameLog, { type Props } from "./GameLog"
import PasswordForm from "components/base/common/FormElements/PasswordForm"
import { GameLogWatchWrapper, ErrorContainer } from "./LogStyles"


export default function GameLogWatch({ authed, message, login, disabled, ...props }: Props & LogWatchHook & { disabled?: boolean }) {
    return (
        <GameLogWatchWrapper>{
            disabled ? <ErrorContainer text="Observing this game has been disabled by the host." /> :
            !authed ? <PasswordForm label="Enter Password" message={message} onSubmit={login} fullPage={true} /> : 
            <GameLog {...props} />
        }</GameLogWatchWrapper>
    )
}
