import { Container, Header, Input, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db/connect";
import { getSettingsByCategory, getRangesByCategory } from "../../db/settings";
import { getSession } from "next-auth/client";

function SettingsTable({ settings }) {
  return settings.length === 0 ? null : (
    <Table striped compact celled color="orange">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell collapsing>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {settings.map((e) => (
          <Table.Row key={e._id}>
            <Table.Cell>{e.text}</Table.Cell>
            <Table.Cell>
              <Input label={e.unit} defaultValue={e.value} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function RangeTable({ ranges }) {
  return ranges.length === 0 ? null : (
    <Table striped compact celled color="orange">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing>From</Table.HeaderCell>
          <Table.HeaderCell collapsing>To</Table.HeaderCell>
          <Table.HeaderCell collapsing>Price</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ranges.map((e) => (
          <Table.Row key={e._id}>
            <Table.Cell>
              <Input fluid defaultValue={e.lowerLimit} />
            </Table.Cell>
            <Table.Cell>
              <Input fluid defaultValue={e.upperLimit} />
            </Table.Cell>
            <Table.Cell>
              <Input fluid label={e.unit} defaultValue={e.value} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default function InterfacePage({ settings = [], ranges = [] }) {
  return (
    <Container>
      <Header>Price per Interface</Header>
      <SettingsTable settings={settings} />
      <RangeTable ranges={ranges} />
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
  const settings = await getSettingsByCategory(db, ctx.params.category);
  const ranges = await getRangesByCategory(db, ctx.params.category);

  return { props: { settings, ranges } };
}
