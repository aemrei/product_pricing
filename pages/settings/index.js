import { Pane, Paragraph, Tab, Tablist, Text } from "evergreen-ui";
import { useState } from "react";
import Container from "../../components/MainContent";

const Params = ({tabs}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Container>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24} background="orangeTint">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.name}
            id={tab.name}
            onSelect={() => setSelectedIndex(index)}
            isSelected={index === selectedIndex}
            aria-controls={`panel-${tab.name}`}
          >
            {tab.name}
          </Tab>
        ))}
      </Tablist>
      <Pane padding={16} background="tint1" flex="1">
        {tabs.map((tab, index) => (
          <Pane
            key={tab.name}
            id={`panel-${tab.name}`}
            role="tabpanel"
            aria-labelledby={tab.name}
            aria-hidden={index !== selectedIndex}
            display={index === selectedIndex ? 'block' : 'none'}
          >
            <Paragraph>Panel {tab.name}</Paragraph>
          </Pane>
        ))}
      </Pane>
      </Container>
  )
}

Params.defaultProps = {
  tabs: [
    { name: '🔌 Modules', link: '/module' },
    { name: '🗺 Country', link: '/country' },
    { name: '💱 Currency', link: '/currency' },
    { name: '🍔 BigMac', link: '/bigmac' },
  ],
}

export default Params;