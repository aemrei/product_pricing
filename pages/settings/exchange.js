import {
  Container,
  Header,
  Table,
} from "semantic-ui-react";
import { getExchangeRates } from "../../db/externalData";

export default function ExchangeRatePage({exchangeRates}){
  return (
    <Container>
      <Header>Exchange Rates</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Rate</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {
          exchangeRates.map(e =>
            <Table.Row key={e._id}>
              <Table.Cell>{e.text}</Table.Cell>
              <Table.Cell>{e.rate}</Table.Cell>
            </Table.Row>
          )
        }
        </Table.Body>
      </Table>
    </Container>
  )
}

export async function getStaticProps(ctx) {
  const exchangeRates = await getExchangeRates();

  return { props: { exchangeRates } };
}