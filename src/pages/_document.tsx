import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'


function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:site_name" content="Mtg Drafter" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:description" content="Multi-player TCG draft simulator." />
        <meta property="article:author" content="bathtaters" />
        <meta name="description" content="Multi-player TCG draft simulator." />

        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000033" />
        
        <link rel="canonical" href="/index.html" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <link rel="icon" href="/favicon.ico" />

        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document