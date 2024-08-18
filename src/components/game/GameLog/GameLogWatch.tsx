import GameLog from "./GameLog"
import PasswordForm from "components/base/common/FormElements/PasswordForm"
import { GameLogWatchWrapper, ErrorContainer } from "./LogStyles"
import useLogWatch, { Props } from "./logWatch.controller"


export default function GameLogWatch(props: Props) {
    const { authed, message, handleSubmit, logout } = useLogWatch(props)

    return (
        <GameLogWatchWrapper title="Live Draft View">{
            !props.game?.watchKey ? <ErrorContainer text="Observing this game has been disabled by the host." /> :
            !authed ? <PasswordForm label="Enter Password" message={message} onSubmit={handleSubmit} fullPage={true} /> : 
            <GameLog {...props} logout={logout} />
        }</GameLogWatchWrapper>
    )
}
