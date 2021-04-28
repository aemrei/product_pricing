import { useSession } from 'next-auth/client';
import NextLink from 'next/link';
import Container from './MainContent'
import { Pane, majorScale, Text, Button, Heading, SettingsIcon, ListDetailViewIcon, AddIcon, Icon } from 'evergreen-ui';

const HomeNav = ({ links }) => {
  const [session] = useSession();

  return (
    <nav>
    <Container>
      <Pane display="flex" padding={16} background="greenTint" borderRadius={3}>
        <Pane flex={1} alignItems="center" display="flex">
          <NextLink href="/">
            <a>
              <Heading size={600}>🌎 FitGlobal Product Pricing</Heading>
            </a>
          </NextLink>
          </Pane>
          <Pane display="flex" justifyContent="space-around" alignItems="center">
            {links && links.length > 0
              ? links.map((link) => (
                  <Pane paddingX={majorScale(3)} key={link.name}>
                    <NextLink href={link.link}>
                      <a>
                        <Icon icon={link.icon} size={12} />
                        <Text size={500}> {link.name}</Text>
                      </a>
                    </NextLink>
                  </Pane>
                ))
              : null}
          </Pane>
          <Pane>
            <NextLink href={session ? '/create' : '/signin'}>
              <a>
                <Button appearance="primary" fontSize="16px">
                  {session ? 'Create' : 'Sign up'}
                </Button>
              </a>
            </NextLink>
          </Pane>
        </Pane>
      </Container>
    </nav>
  )
};

HomeNav.defaultProps = {
  links: [
    { icon: AddIcon, name: 'Create', link: '/create' },
    { icon: ListDetailViewIcon, name: 'Offers', link: '/offers' },
    { icon: SettingsIcon, name: 'Settings', link: '/settings' },
  ],
}

export default HomeNav;