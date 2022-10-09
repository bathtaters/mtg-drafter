import type { AppProps } from 'next/app'
import Head from 'next/head'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AppWrapperStyle } from '../components/base/styles/AppStyles'
import '../styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapperStyle>
      <Head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /></Head>

      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </AppWrapperStyle>
  )
}

export default App
