import Link from 'next/link'
import Image from 'next/image'
import type { SetupProps } from 'types/setup'
import Header from 'components/base/Header'
import Footer from 'components/base/Footer'
import SetupForm from './SetupForm'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'
import logo from 'assets/media/logo-lg.png'

export default function Setup({ setList }: SetupProps) {
  return (<>
    <SetPageTitle title="Create Game" />

    <Header>
      <Link href="/">
        <Image className="w-16 sm:w-24 h-auto" src={logo} alt="Mtg-Drafter Logo" />
      </Link>
      <h1 className="font-serif">Create New Draft</h1>
      <div className="w-16 sm:w-24 invisible" />
    </Header>
    
    <BodyWrapperStyle>
      <SetupForm setList={setList} />
    </BodyWrapperStyle>

    <Footer />
  </>)
}
