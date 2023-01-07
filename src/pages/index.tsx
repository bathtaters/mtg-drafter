import type { NextPage, InferGetStaticPropsType } from 'next'
import type { SetupProps } from 'types/setup'
import prisma from 'backend/libs/db'
import Setup from 'components/setup/Setup'
const Page: NextPage<SetupProps> = (props: InferGetStaticPropsType<typeof getStaticProps>) => <Setup {...props} />

export async function getStaticProps() {
  const setList = await prisma.cardSet.findMany({ orderBy: { releaseDate: 'desc' } })
  return { props: { setList } }
}

export default Page
