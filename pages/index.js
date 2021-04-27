import { Pane } from "evergreen-ui"
import HomeNav from "../components/HomeNav"
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Pane>
      <header>
        <HomeNav/>
      </header>
      <main>
        <span>Body</span>
      </main>
    </Pane>
  )
}
