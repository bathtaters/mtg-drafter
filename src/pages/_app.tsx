import type { AppProps } from 'next/app'
import Head from 'next/head'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AppWrapperStyle } from '../components/base/styles/AppStyles'
import '../styles/globals.css'

import { Inter, EB_Garamond } from '@next/font/google'
const inter = Inter()
const garamond = EB_Garamond()


function App({ Component, pageProps }: AppProps) {
  return (
    <AppWrapperStyle>
      <Head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /></Head>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-garamond: ${garamond.style.fontFamily};
        }
      `}</style>

      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </AppWrapperStyle>
  )
}

export default App
