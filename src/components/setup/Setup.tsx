import type { SetupProps } from 'types/setup'
import Header from 'components/base/Header'
import Footer from 'components/base/Footer'
import SetupForm from './SetupForm'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'

export default function Setup({ setList }: SetupProps) {
  return (<>
    <SetPageTitle title="Create Game" />

    <Header><h1 className="font-serif">Create New Draft</h1></Header>
    
    <BodyWrapperStyle>
      <SetupForm setList={setList} />
    </BodyWrapperStyle>

    <Footer />
  </>)
}
