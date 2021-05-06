import { Container, Header, Input, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { CATEGORY_LIST, connectToDB, getSettingsByCategory, getRangesByCategory } from "../../db";

function SettingsTable({ settings }) {
  return settings.length === 0 ? null : (
    <Table striped compact celled>
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
    <Table striped compact celled>
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

export async function getStaticPaths() {
  const result = { paths: CATEGORY_LIST.map((c) => ({ params: { category: c._id } })), fallback: false };
  return result;
}

export async function getStaticProps(ctx) {
  const { db } = await connectToDB();
  const settings = await getSettingsByCategory(db, ctx.params.category);
  const ranges = await getRangesByCategory(db, ctx.params.category);

  return { props: { settings, ranges } };
}
