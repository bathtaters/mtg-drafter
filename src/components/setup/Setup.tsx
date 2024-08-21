import type { SetupProps } from 'types/setup'
import SetupForm from './SetupForm'
import Header from 'components/base/Header'
import Footer from 'components/base/Footer'
import { HeaderLogo, HistoryLink, TitleStyle } from './SetupStyles'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'

export default function Setup({ setList }: SetupProps) {
  return (<>
    <SetPageTitle title="Create Game" />

    <Header>
      <HeaderLogo href="/" />
      <TitleStyle>Create New Draft</TitleStyle>
      <HistoryLink href="/game" tip="Game History" />
    </Header>
    
    <BodyWrapperStyle>
      <SetupForm setList={setList} />
    </BodyWrapperStyle>

    <Footer />
  </>)
}
