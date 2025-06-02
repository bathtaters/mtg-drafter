import type {
  GetServerSidePropsContext,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import type { GameHistoryServerSideProps } from "types/game";
import GameHistory from "components/game/GameHistory/GameHistory";
import handler from "backend/controllers/getGameHistory.controller";

const Page: NextPage<GameHistoryServerSideProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => <GameHistory {...props} />;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  handler(ctx).then((props) => ({ props }));

export default Page;
