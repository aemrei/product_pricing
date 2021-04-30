import {
  Button,
  Container,
  Dropdown,
  Icon,
  Menu,
} from "semantic-ui-react"
import NextLink from "next/link"

const HeaderBar = () => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <NextLink href="/" passHref>
          <Menu.Item as='a' header>
            🌎 FitGlobal Product Pricing
          </Menu.Item>
        </NextLink>

        <NextLink href="/create" passHref>
          <Menu.Item as='a' header>
            Create
          </Menu.Item>
        </NextLink>

        <Dropdown item simple text='Settings'>
          <Dropdown.Menu>
            <NextLink href="/settings/product" passHref>
              <Dropdown.Item as="a"><Icon name="cart"/>Product Prices</Dropdown.Item>
            </NextLink>
            <NextLink href="/settings/interface" passHref>
              <Dropdown.Item as="a"><Icon name="connectdevelop"/>Interface Prices</Dropdown.Item>
            </NextLink>
            <NextLink href="/settings/user" passHref>
              <Dropdown.Item as="a"><Icon name="users"/>User Prices</Dropdown.Item>
            </NextLink>
            <NextLink href="/settings/fees" passHref>
              <Dropdown.Item as="a"><Icon name="money"/>Other Fees</Dropdown.Item>
            </NextLink>
            <Dropdown.Divider />
            <NextLink href="/settings/bigmac" passHref>
              <Dropdown.Item as="a">🍔🍔 BigMac Index</Dropdown.Item>
            </NextLink>
            <NextLink href="/settings/exchange" passHref>
              <Dropdown.Item as="a"><Icon name="eur"/>Exchange Rates</Dropdown.Item>
            </NextLink>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item position='right'>
          <Button primary><Icon name="sign-in"/>Sign In</Button>
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default HeaderBar;