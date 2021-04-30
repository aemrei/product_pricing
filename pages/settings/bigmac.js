import {
  Container,
  Header,
  Table,
} from "semantic-ui-react";
import { getCountries } from "../../db/settings";

export default function BigMacPage({countryBigMac}){
  return (
    <Container>
      <Header>BigMac Index</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Dollar Ratio</Table.HeaderCell>
            <Table.HeaderCell>Euro Ratio</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {
          countryBigMac.map(e =>
            <Table.Row key={e.key}>
              <Table.Cell>{e.text}</Table.Cell>
              <Table.Cell>{e.dollar_ratio}</Table.Cell>
              <Table.Cell>{e.euro_ratio}</Table.Cell>
            </Table.Row>
          )
        }
        </Table.Body>
      </Table>
    </Container>
  )
}

export async function getStaticProps(ctx) {
  const countryBigMac = await getCountries();

  return { props: { countryBigMac } };
}