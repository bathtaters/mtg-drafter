import type { GetServerSidePropsContext, NextPage, InferGetServerSidePropsType } from 'next'
import type { ServerProps } from 'types/game'
import Game from 'components/game/index/Game'
import { serverSideHandler } from 'backend/controllers/getGame.controller'

const Page: NextPage<ServerProps> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => <Game {...props} />

export const getServerSideProps = (ctx: GetServerSidePropsContext) => serverSideHandler(ctx).then((props) => ({ props }))

export default Page