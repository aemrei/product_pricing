import { Container, Header, Table } from "semantic-ui-react";
import { connectToDB } from "../../db";
import { getExchanges } from "../../db/externalData";
import { getSession } from "next-auth/client";

export default function ExchangeRatePage({ exchanges = [] }) {
  return (
    <Container text>
      <Header>Exchange Rates</Header>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Rate</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(exchanges).map((e) => (
            <Table.Row key={e.code}>
              <Table.Cell>{e.name}</Table.Cell>
              <Table.Cell>{e.rate}</Table.Cell>
              <Table.Cell>{e.date}</Table.Cell>
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
    return { props: {} };
  }

  const { db } = await connectToDB();

  const exchanges = await getExchanges(db);

  return { props: { exchanges } };
}
