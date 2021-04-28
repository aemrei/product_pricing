import React from 'react'
import { Pane } from 'evergreen-ui'
import Container from "./Container"

const MainContent = ({ children, ...styles }) => (
  <main>
    <Pane height={120}>
      <Container>
        {children}
      </Container>
    </Pane>
  </main>
)

export default MainContent