import type { AppProps } from 'next/app'
import '../styles/footer.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}