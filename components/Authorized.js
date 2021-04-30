import React from 'react'
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSession } from 'next-auth/client'
import { Container } from "semantic-ui-react"

const Authorized = ({ children, ...styles }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && router.route !== "/") {
      router.push('/');
    }
  }, [session, router]);

  return (
    <Container>
      {session ? children : <span>Please login</span>}
    </Container>
  );
}

export default Authorized
