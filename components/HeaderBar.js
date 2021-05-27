import { Button, Container, Dropdown, Icon, Image, Label, Menu } from "semantic-ui-react";
import NextLink from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";

const GoToHome = () => (
  <NextLink href="/" passHref>
    <Menu.Item as="a" header>
      🌎 FitGlobal Product Pricing
      {process.env.NEXT_PUBLIC_NODE_ENV === "development" && (
        <Label color="yellow">
          <Icon name="warning sign" />
          Dev
        </Label>
      )}
    </Menu.Item>
  </NextLink>
);

const HeaderBar = () => {
  const [session, loading] = useSession();
  const permissions = session?.user?.role?.permissions || {};

  if (!session || loading) {
    return (
      <Menu fixed="top" inverted>
        <Container>
          <GoToHome />

          <Menu.Item position="right">
            {!loading && (
              <Button primary onClick={() => signIn("google")}>
                <Icon name="sign-in" />
                Login
              </Button>
            )}
          </Menu.Item>
        </Container>
      </Menu>
    );
  }

  return (
    <Menu fixed="top" inverted>
      <Container>
        <GoToHome />

        {permissions.createItem && (
          <NextLink href="/quotation/create" passHref>
            <Menu.Item as="a" header>
              Create
            </Menu.Item>
          </NextLink>
        )}

        {permissions.displaySettings && (
          <Dropdown item text="Settings">
            <Dropdown.Menu>
              <NextLink href="/settings/product" passHref>
                <Dropdown.Item as="a">
                  <Icon name="cart" />
                  Product Prices
                </Dropdown.Item>
              </NextLink>
              <NextLink href="/settings/interface" passHref>
                <Dropdown.Item as="a">
                  <Icon name="connectdevelop" />
                  Interface Prices
                </Dropdown.Item>
              </NextLink>
              <NextLink href="/settings/user" passHref>
                <Dropdown.Item as="a">
                  <Icon name="users" />
                  User Prices
                </Dropdown.Item>
              </NextLink>
              <NextLink href="/settings/fee" passHref>
                <Dropdown.Item as="a">
                  <Icon name="money" />
                  Other Fees
                </Dropdown.Item>
              </NextLink>
              <Dropdown.Divider />
              <NextLink href="/settings/bigmac" passHref>
                <Dropdown.Item as="a">🍔🍔 BigMac Index</Dropdown.Item>
              </NextLink>
            </Dropdown.Menu>
          </Dropdown>
        )}

        <Menu.Menu position="right">
          <Dropdown
            item
            trigger={
              <span>
                <Image src={session.user.image} bordered avatar />
                {session.user.name}
              </span>
            }
          >
            <Dropdown.Menu style={{ zIndex: 10 }}>
              <Dropdown.Header icon="user outline" content={session.user.role?.text} />
              <Dropdown.Item
                icon="log out"
                text="Log Out"
                onClick={() => {
                  signOut();
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default HeaderBar;
