import type { NextPage, InferGetStaticPropsType } from 'next'
import type { BoosterBasic, SetupProps } from 'types/setup'
import prisma from 'backend/libs/db'
import Setup from 'components/setup/Setup'
import { skipBoosterTypes } from 'assets/constants'

const Page: NextPage<SetupProps> = (props: InferGetStaticPropsType<typeof getStaticProps>) => <Setup {...props} />

export async function getStaticProps() {
  const setList = await prisma.booster.findMany({
    where: { boosterType: { notIn: skipBoosterTypes } },
    select: { boosterType: true, set: { select: { code: true, name: true, block: true } } },
    orderBy: { set: { releaseDate: 'desc' } },
  }) as BoosterBasic[]
  return { props: { setList } }
}

export default Page
