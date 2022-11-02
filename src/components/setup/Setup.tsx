import Header from 'components/base/Header'
import Footer from 'components/base/Footer'
import SetupForm from './SetupForm'
import { BodyWrapperStyle, SetPageTitle } from 'components/base/styles/AppStyles'

export default function Setup() {
  return (<>
    <SetPageTitle title="Create Game" />

    <Header><h1>Create New Draft</h1></Header>
    
    <BodyWrapperStyle>
      <SetupForm />
    </BodyWrapperStyle>

    <Footer />
  </>)
}
