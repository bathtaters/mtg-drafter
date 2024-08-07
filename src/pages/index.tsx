import type { NextPage, InferGetStaticPropsType } from 'next'
import type { SetBasic, SetupProps } from 'types/setup'
import prisma from 'backend/libs/db'
import Setup from 'components/setup/Setup'
const Page: NextPage<SetupProps> = (props: InferGetStaticPropsType<typeof getStaticProps>) => <Setup {...props} />

export async function getStaticProps() {
  const setList = await prisma.cardSet.findMany({
    select: { code: true, name: true, block: true, boosterType: true },
    orderBy: { releaseDate: 'desc' }
  }) as SetBasic[]
  return { props: { setList } }
}

export default Page
