import { Container, Header, Input, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db/connect";
import { getSettings, getRanges } from "../../db/settings";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { categoryReducer, initCategoryReducer, RESET, UPDATE_RANGE, UPDATE_SETTING } from "../../utils/settingsReducer";
import { useReducer } from "react";

const PAGE_TITLES = {
  fee: "Other Fees",
  interface: "Per interface prices",
  product: "Product Prices",
  user: "Per user prices",
};

const saveConfigs = async (data) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/config`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function SettingsTable({ settings, dispatch }) {
  return settings.length === 0 ? null : (
    <Table striped compact celled color="orange">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell collapsing>Value</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {settings.map((s) => (
          <Table.Row key={s._id}>
            <Table.Cell>{s.text}</Table.Cell>
            <Table.Cell>
              <Input
                label={s.unit}
                value={s.value}
                onChange={(e, { value }) => dispatch({ type: UPDATE_SETTING, payload: { ...s, value: +value } })}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function RangeTable({ ranges, dispatch }) {
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
        {ranges.map((r) => (
          <Table.Row key={r._id}>
            <Table.Cell>
              <Input
                fluid
                value={r.lowerLimit}
                onChange={(e, { value }) => dispatch({ type: UPDATE_RANGE, payload: { ...r, lowerLimit: +value } })}
              />
            </Table.Cell>
            <Table.Cell>
              <Input
                fluid
                value={r.upperLimit}
                onChange={(e, { value }) => dispatch({ type: UPDATE_RANGE, payload: { ...r, upperLimit: +value } })}
              />
            </Table.Cell>
            <Table.Cell>
              <Input
                fluid
                label={r.unit}
                value={r.value}
                onChange={(e, { value }) => dispatch({ type: UPDATE_RANGE, payload: { ...r, value: +value } })}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default function CategorySettingPage({ settings = [], ranges = [] }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(categoryReducer, { settings, ranges }, initCategoryReducer);
  const title = PAGE_TITLES[router.query.category] || "Settings";
  const categorySettings = state.settings.filter((s) => s.category === router.query.category);
  const categoryRanges = state.ranges.filter((r) => r.category === router.query.category);

  return (
    <Container text>
      <Header>{title}</Header>
      <SettingsTable settings={categorySettings} dispatch={dispatch} />
      <RangeTable ranges={categoryRanges} dispatch={dispatch} />
      <SaveButtons
        onReset={() => dispatch({ type: RESET, payload: { settings, ranges } })}
        onSave={() => saveConfigs({ settings: categorySettings, ranges: categoryRanges })}
      />
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session || !session.user) {
    return { props: {} };
  }

  const { db } = await connectToDB();
  const settings = await getSettings(db);
  const ranges = await getRanges(db);

  return { props: { settings, ranges } };
}
