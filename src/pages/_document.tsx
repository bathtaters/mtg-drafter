import { Html, Head, Main, NextScript, DocumentProps } from 'next/document'

function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        <meta property="og:site_name" content="Mtg Drafter" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:description" content="Multi-player TCG draft simulator." />
        <meta property="article:author" content="bathtaters" />
        <meta name="description" content="Multi-player TCG draft simulator." />
        <link rel="canonical" href="/index.html" />

        <meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0F172A" />
        
        <link rel="manifest" href="/app.webmanifest" />
        <link rel="apple-touch-icon" sizes="16x16" href="/icon-16.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="32x32" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="44x44" href="/icon-44.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="71x71" href="/icon-71.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="150x150" href="/icon-150.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="310x310" href="/icon-310.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" type="image/png" />
        <link rel="icon" sizes="120x120" href="/icon-120-ios.png" type="image/png" />
        <link rel="icon" sizes="180x180" href="/icon-180-ios.png" type="image/png" />
        <link rel="icon" sizes="76x76" href="/icon-76-ios.png" type="image/png" />
        <link rel="icon" sizes="152x152" href="/icon-152-ios.png" type="image/png" />
        <link rel="icon" sizes="167x167" href="/icon-167-ios.png" type="image/png" />
        <link rel="icon" sizes="1024x1024" href="/icon-1024-ios.png" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document