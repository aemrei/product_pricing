import Head from 'next/head'
import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import HeaderBar from "../components/HeaderBar"
import { Provider } from 'next-auth/client'
import {
  Container,
  Divider,
} from "semantic-ui-react"
import Authorized from "../components/Authorized"

function MyApp({ Component, pageProps }) {

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Product Pricing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderBar/>
      <main>
        <Container text style={{ marginTop: '4em' }}>
          <Authorized>
            <Component {...pageProps} />
          </Authorized>
        </Container>
      </main>
      <Divider/>
    </Provider>
  );
}

export default MyApp
