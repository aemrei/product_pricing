import { Container, Header, Input, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db";
import { CATEGORY_INTERFACE, getSettingsByCategory, getRangesByCategory } from "../../db";
import { getSession } from 'next-auth/client'

export default function InterfacePage({ interfaceSettings, interfaceRanges }) {
  return (
    <Container>
      <Header>Price per Interface</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell collapsing>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {interfaceSettings.map((e) => (
            <Table.Row key={e._id}>
              <Table.Cell>{e.text}</Table.Cell>
              <Table.Cell>
                <Input label={e.unit} defaultValue={e.value} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>From</Table.HeaderCell>
            <Table.HeaderCell collapsing>To</Table.HeaderCell>
            <Table.HeaderCell collapsing>Price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {interfaceRanges.map((e) => (
            <Table.Row key={e._id}>
              <Table.Cell>
                <Input defaultValue={e.lowerLimit} />
              </Table.Cell>
              <Table.Cell>
                <Input defaultValue={e.upperLimit} />
              </Table.Cell>
              <Table.Cell>
                <Input label={e.unit} defaultValue={e.value} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <SaveButtons />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session || !session.user) {
    // return { props: {} };
  }

  const { db } = await connectToDB();
  const interfaceSettings = await getSettingsByCategory(db, CATEGORY_INTERFACE);
  const interfaceRanges = await getRangesByCategory(db, CATEGORY_INTERFACE);

  return { props: { interfaceSettings, interfaceRanges } };
}
