import { Container, Flag, Header, Icon, Table } from "semantic-ui-react";
import { connectToDB } from "../../db";
import { getCountries } from "../../db/settings";
import { getSession } from 'next-auth/client'

const icons = ["eur", "usd"];

export default function BigMacPage({ countryBigMac }) {
  return (
    <Container>
      <Header>BigMac Index</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Currency</Table.HeaderCell>
            <Table.HeaderCell>Dollar Ratio</Table.HeaderCell>
            <Table.HeaderCell>Euro Ratio</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {countryBigMac.map((e) => (
            <Table.Row key={e._id}>
              <Table.Cell collapsing>
                {icons.includes(e._id) ? <Icon name={e._id} /> : <Flag name={e._id} />}
              </Table.Cell>
              <Table.Cell>{e.text}</Table.Cell>
              <Table.Cell>{e.dollar_ratio}</Table.Cell>
              <Table.Cell>{e.euro_ratio}</Table.Cell>
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

  const countryBigMac = await getCountries(db);

  return { props: { countryBigMac } };
}
