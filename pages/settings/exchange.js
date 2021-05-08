import { Container, Header, Table } from "semantic-ui-react";
import { connectToDB } from "../../db";
import { getExchangeRates } from "../../db/externalData";
import { getSession } from "next-auth/client";

export default function ExchangeRatePage({ exchangeRates = [] }) {
  return (
    <Container text>
      <Header>Exchange Rates</Header>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Rate</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {exchangeRates.map((e) => (
            <Table.Row key={e._id}>
              <Table.Cell>{e.text}</Table.Cell>
              <Table.Cell>{e.rate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session || !session.user) {
    // return { props: {} };
  }

  const { db } = await connectToDB();

  const exchangeRates = await getExchangeRates(db);

  return { props: { exchangeRates } };
}
