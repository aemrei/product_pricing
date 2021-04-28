
import { Provider } from 'next-auth/client'
import HomeNav from "../components/HomeNav";
import MainContent from "../components/MainContent";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <HomeNav/>
      <MainContent>
        <Component {...pageProps} />
      </MainContent>
    </Provider>
  );
}

export default MyApp
