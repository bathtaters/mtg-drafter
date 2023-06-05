import type { GetServerSidePropsContext, NextPage, InferGetServerSidePropsType } from 'next'
import { serverSideHandler } from 'backend/controllers/getGame.controller'
import LogModal from 'components/game/LogModal/LogModal'
import Loader from 'components/base/Loader'
import useGameLog from 'components/game/LogModal/log.controller'
import { useRouter } from 'next/router'

export const getServerSideProps = (ctx: GetServerSidePropsContext) => serverSideHandler(ctx).then((props) => ({ props }))

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const gameLog = useGameLog(router.query.url as string, props.players)
    setInterval(gameLog.refresh, 1000)
    
    if (!props.players) return <Loader>Loading Log...</Loader>
    

    return <LogModal log={gameLog} players={props.players} gameEnded={true} isOpen={true} setOpen={()=>{}} />
}