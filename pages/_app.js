import Head from "next/head";
import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import HeaderBar from "../components/HeaderBar";
import { Provider } from "next-auth/client";
import { Container, Dimmer, Divider, Loader } from "semantic-ui-react";
import Authorized from "../components/Authorized";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>Product Pricing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderBar />
      <main>
        <Container style={{ marginTop: "5em" }}>
          <Dimmer active={loading}>
            <Loader size="massive"/>
          </Dimmer>

          <Authorized>
            <Component {...pageProps} />
          </Authorized>
        </Container>
      </main>
      <Divider />
    </Provider>
  );
}

export default MyApp;
