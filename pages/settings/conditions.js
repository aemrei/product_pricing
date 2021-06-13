import { Container, Form, Header, Icon, Popup, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db/connect";
import { getConditions } from "../../db/conditions";
import { getSession, useSession } from "next-auth/client";
import { RESET } from "../../utils/settingsReducer";
import { useState } from "react";
import simulateConditions from "../../utils/simulateConditions";

const saveConditions = async (data) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/config`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function StringField({ name, row, updateField, isTechnical, width }) {
  return (
    <Form.Input
      value={row[name]}
      style={{ width: width || (isTechnical ? "5rem" : "10rem") }}
      onChange={(e, { value }) => {
        updateField(row._id, name, value);
      }}
    />
  );
}

function NumericField({ name, row, updateField, isTechnical }) {
  return (
    <Form.Input
      value={row[name]}
      style={{ width: isTechnical ? "7rem" : "14rem" }}
      onChange={(e, { value }) => {
        updateField(row._id, name, +value);
      }}
    />
  );
}

function FieldCheckbox({ name, row, updateField, isTechnical }) {
  return (
    <Form.Checkbox
      checked={row[name]}
      style={{ width: isTechnical ? "5rem" : "10rem" }}
      onChange={(e, { checked }) => {
        updateField(row._id, name, checked);
      }}
    />
  );
}

function ConditionsTable({ conditions, isTechnical, updateField }) {
  return (
    <Container style={{ overflow: "auto", maxWidth: 1200 }}>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            {isTechnical && <Table.HeaderCell collapsing>Code</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell>Category</Table.HeaderCell>}
            <Table.HeaderCell collapsing>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing>Type</Table.HeaderCell>
            {isTechnical && <Table.HeaderCell collapsing>Order</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>CalcOrder</Table.HeaderCell>}
            <Table.HeaderCell collapsing>Unit Price</Table.HeaderCell>
            <Table.HeaderCell collapsing>Unit</Table.HeaderCell>
            {isTechnical && <Table.HeaderCell collapsing>Manual</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Result</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Stat?</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Tech?</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Error</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell>Calculation</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {conditions.map((c) => {
            return (
              (isTechnical || !c.isTechnical) && (
                <Table.Row key={c._id}>
                  {isTechnical && <Table.Cell collapsing>{c.productCode}</Table.Cell>}
                  {isTechnical && <Table.Cell collapsing>{c.category}</Table.Cell>}
                  <Table.Cell collapsing>{c.name}</Table.Cell>
                  <Table.Cell collapsing>{c.type}</Table.Cell>
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <NumericField
                        name="order"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && <Table.Cell collapsing>{c.calcOrder}</Table.Cell>}
                  <Table.Cell collapsing>
                    <NumericField
                      name="unitPrice"
                      row={c}
                      isTechnical={isTechnical}
                      updateField={updateField}
                    />
                  </Table.Cell>
                  <Table.Cell collapsing>{c.unit}</Table.Cell>
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <NumericField
                        name="manual"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      {typeof c.result === "number" ? c.result.toLocaleString() : c.result}
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <FieldCheckbox
                        name="isStatistical"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <FieldCheckbox
                        name="isTechnical"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      {c.errorText && (
                        <Popup
                          trigger={<Icon circular name="exclamation circle" />}
                          content={c.errorText}
                          inverted
                        />
                      )}
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell>
                      <StringField
                        name="calculation"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                        width="50rem"
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              )
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}

export default function CategorySettingPage({ conditions = [] }) {
  const [session, loading] = useSession();
  const [isTechnical, setIsTechnical] = useState(false);
  const [data, setData] = useState(conditions);
  const permissions = session?.user?.role?.permissions || {};

  const updateField = (_id, name, value) => {
    const index = data.findIndex((d) => d._id === _id);
    const row = data[index];
    const newRow = { ...row, [name]: value };
    setData([...data.slice(0, index), newRow, ...data.slice(index + 1)]);
  };

  const simulate = () => {
    const configs = {
      maintenanceFeePercent: 25,
      dollarRate: 2,
      bigMacRatio: 1.5,
    };
    setData(simulateConditions(data, configs));
  };

  if (!permissions.displaySettings) {
    return <span>You are not authorized.</span>;
  }

  return (
    <Container text={!isTechnical}>
      <Header>Conditions</Header>
      <ConditionsTable conditions={data} updateField={updateField} isTechnical={isTechnical} />
      {permissions.updateSettings && (
        <SaveButtons
          onReset={() => dispatch({ type: RESET, payload: { conditions } })}
          onSave={() => saveConditions({ conditions })}
        />
      )}
      <Form.Checkbox
        checked={isTechnical}
        onChange={(e, { checked }) => setIsTechnical(checked)}
        label="Advanced view"
      />
      {isTechnical && (
        <Form.Button type="button" onClick={simulate}>
          Simulate
        </Form.Button>
      )}
    </Container>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session || !session.user) {
    return { props: {} };
  }

  const { db } = await connectToDB();
  const conditions = await getConditions(db);

  return { props: { conditions } };
}
