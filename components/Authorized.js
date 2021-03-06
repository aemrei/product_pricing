import React from 'react'
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSession, signIn } from 'next-auth/client'
import { Container } from "semantic-ui-react"

const Authorized = ({ children, ...styles }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session && router.route !== "/") {
      signIn("google")
    }
  }, [session, router, loading]);

  return (
    <Container {...styles}>
      {loading ? <span>Please wait...</span> : session ? children : <span>Please login</span>}
    </Container>
  );
}

export default Authorized
