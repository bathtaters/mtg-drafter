import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:site_name" content="MtG Drafter" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:description" content="Magic: the Gathering multi-player draft simulator." />
        <meta property="article:author" content="bathtaters" />
        <meta name="description" content="Magic: the Gathering multi-player draft simulator." />

        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000033" />
        
        <link rel="canonical" href="/index.html" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />

        <meta http-equiv="x-ua-compatible" content="ie=edge" />

        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" />
        <link href="//cdn.jsdelivr.net/npm/mana-font@latest/css/mana.min.css" rel="stylesheet" type="text/css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}