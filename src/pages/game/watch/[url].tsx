import type {
  GetServerSidePropsContext,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import type { ServerProps } from "types/game";
import Watch from "components/game/index/Watch";
import { serverSideHandler } from "backend/controllers/getGame.controller";

const Page: NextPage<ServerProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => <Watch {...props} />;

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  serverSideHandler(ctx).then((props) => ({ props }));

export default Page;
