import { Button, Container, Form, Header, Icon, Popup, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db/connect";
import { getConditions } from "../../db/conditions";
import { getSession, useSession } from "next-auth/client";
import { useState } from "react";
import simulateConditions from "../../utils/simulateConditions";
import { nanoid } from "nanoid";
import { getCountries, getExchanges } from "../../db";

const saveConditions = async (conditions) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/conditions`, {
    method: "PUT",
    body: JSON.stringify(conditions),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function StringField({ name, row, updateField, isTechnical, width }) {
  return (
    <Form.Input
      value={row[name] || ""}
      style={{ width: width || "10rem" }}
      onChange={(e, { value }) => {
        updateField(row._id, name, value);
      }}
    />
  );
}

function createNewCondition() {
  return {
    _id: nanoid(12),
    calcOrder: 0,
    calculation: "",
    category: "",
    errorText: "",
    isStatistical: true,
    isTechnical: true,
    manual: 0,
    name: "",
    order: 0,
    productCode: "",
    remarks: "",
    result: 0,
    settingsOrder: 99990,
    type: "",
    unit: "",
    unitPrice: 0,
  };
}

function RemoveConfigLine({ row, handler, isTechnical, width }) {
  return isTechnical ? (
    <Button type="button" style={{ width: width || "10rem" }} onClick={() => handler(row._id)}>
      ❌
    </Button>
  ) : null;
}

function NumericField({ name, row, updateField, isTechnical }) {
  return (
    <Form.Input
      value={row[name] || ""}
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

function ConditionsTable({ conditions, isTechnical, updateField, removeLine }) {
  return (
    <Container style={{ overflow: "auto", maxWidth: 1200 }}>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>Code</Table.HeaderCell>
            {isTechnical && <Table.HeaderCell>Category</Table.HeaderCell>}
            <Table.HeaderCell collapsing>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing>Type</Table.HeaderCell>
            <Table.HeaderCell collapsing>Unit Price</Table.HeaderCell>
            {isTechnical && <Table.HeaderCell collapsing>Unit</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Manual</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Result</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Stat?</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Tech?</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Error</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell>Calculation</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Order</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>CalcOrder</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>SettingsOrder</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Actions</Table.HeaderCell>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {conditions.filter(x => !x.DELETED).map((c) => {
            return (
              (isTechnical || !c.isTechnical) && (
                <Table.Row key={c._id}>
                  <Table.Cell collapsing>
                    {isTechnical ? (
                      <StringField
                        name="productCode"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    ) : (
                      <span>{c.productCode}</span>
                    )}
                  </Table.Cell>
                  {isTechnical && (
                    <Table.Cell collapsing>
                      {isTechnical ? (
                        <StringField
                          name="category"
                          row={c}
                          isTechnical={isTechnical}
                          updateField={updateField}
                        />
                      ) : (
                        <span>{c.category}</span>
                      )}
                    </Table.Cell>
                  )}
                  <Table.Cell collapsing>
                    {isTechnical ? (
                      <StringField
                        name="name"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    ) : (
                      <span>{c.name}</span>
                    )}
                  </Table.Cell>
                  <Table.Cell collapsing>
                    {isTechnical ? (
                      <StringField
                        name="type"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    ) : (
                      <span>{c.type}</span>
                    )}
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <NumericField
                      name="unitPrice"
                      row={c}
                      isTechnical={isTechnical}
                      updateField={updateField}
                    />
                  </Table.Cell>
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <StringField
                        name="unit"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      {c.isStatistical ? (
                        <span>{c.manual}</span>
                      ) : (
                        <NumericField
                          name="manual"
                          row={c}
                          isTechnical={isTechnical}
                          updateField={updateField}
                        />
                      )}
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
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <NumericField
                        name="calcOrder"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <NumericField
                        name="settingsOrder"
                        row={c}
                        isTechnical={isTechnical}
                        updateField={updateField}
                      />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <RemoveConfigLine row={c} handler={removeLine} isTechnical={isTechnical} width="5rem"/>
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

export default function CategorySettingPage(props) {
  const [session, loading] = useSession();
  const [isTechnical, setIsTechnical] = useState(false);
  const [conditions, setConditions] = useState(props.conditions);
  const permissions = session?.user?.role?.permissions || {};
  const [country, setCountry] = useState("eur");
  const bigMac = props.countries.find((c) => c._id === country);

  const updateField = (_id, name, value) => {
    const index = conditions.findIndex((d) => d._id === _id);
    const row = conditions[index];
    const newRow = { ...row, [name]: value };
    const newConditions = [...conditions.slice(0, index), newRow, ...conditions.slice(index + 1)];
    setConditions(newConditions);

    if (isTechnical && typeof value === "number") {
      setConditions(
        simulateConditions(newConditions, {
          dollarRate: props.exchanges.usd.rate,
          bigMacRatio: bigMac.euro_ratio,
        }),
      );
    }
  };

  const addLine = () => {
    const newCondition = createNewCondition();
    setConditions([...conditions, newCondition]);
  };

  const removeLine = (id) => {
    updateField(id, "DELETED", true);
  };

  if (!permissions.displaySettings) {
    return <span>You are not authorized.</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <Container text={!isTechnical}>
      <Header>Conditions</Header>
      <ConditionsTable
        conditions={conditions}
        updateField={updateField}
        isTechnical={isTechnical}
        removeLine={removeLine}
      />
      {isTechnical && (
        <Button type="button" onClick={addLine}>
          Add line
        </Button>
      )}
      {permissions.updateSettings && (
        <SaveButtons
          onReset={() => setConditions(props.conditions)}
          onSave={() => saveConditions({ conditions })}
        />
      )}
      {session?.user?.technical && (
        <Form.Checkbox
          checked={isTechnical}
          onChange={(e, { checked }) => setIsTechnical(checked)}
          label="Advanced view"
        />
      )}
      {isTechnical && (
        <div>
          <Form.Select
            label="Test for country"
            value={country}
            placeholder="Select country where the customer is located"
            onChange={(e, { value }) => {
              setCountry(value);
            }}
            options={props.countries}
          />
          <span>BigMac Ratio: {bigMac.euro_ratio.toFixed(2)}</span>
        </div>
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
  const exchanges = await getExchanges();
  const countries = await getCountries(db);

  return { props: { conditions, exchanges, countries } };
}
