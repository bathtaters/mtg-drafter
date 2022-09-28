import type { NextPage } from 'next'
import Header from '../components/base/Header'
import Footer from '../components/base/Footer'
import SetupForm from '../components/setup/SetupForm'
import { BodyWrapperStyle, SetPageTitle } from '../components/base/AppStyles'


const Setup: NextPage = () => {
  return (<>
    <SetPageTitle title="Create Game" />
    <Header title={<h1>Create New Draft</h1>} />
    
    <BodyWrapperStyle>
      <SetupForm />
    </BodyWrapperStyle>

    <Footer />
  </>)
}

export default Setup
