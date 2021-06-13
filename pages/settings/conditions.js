import { Container, Form, Header, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db/connect";
import { getConditions } from "../../db/conditions";
import { getSession, useSession } from "next-auth/client";
import { RESET } from "../../utils/settingsReducer";
import { useState } from "react";

const saveConditions = async (data) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/config`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function ConditionsTable({ conditions, isTechnical }) {
  return (
    <Container>
      <Table striped compact celled color="orange">
        <Table.Header>
          <Table.Row>
            {isTechnical && <Table.HeaderCell collapsing>Code</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell>Category</Table.HeaderCell>}
            <Table.HeaderCell collapsing>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing>Type</Table.HeaderCell>
            <Table.HeaderCell collapsing>Order</Table.HeaderCell>
            {isTechnical && <Table.HeaderCell collapsing>CalcOrder</Table.HeaderCell>}
            <Table.HeaderCell collapsing>Unit Price</Table.HeaderCell>
            <Table.HeaderCell collapsing>Unit</Table.HeaderCell>
            {isTechnical && <Table.HeaderCell collapsing>Manual</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell>Calculation</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Result</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Remarks</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Stat?</Table.HeaderCell>}
            {isTechnical && <Table.HeaderCell collapsing>Tech?</Table.HeaderCell>}
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
                  <Table.Cell collapsing>{c.order}</Table.Cell>
                  {isTechnical && <Table.Cell collapsing>{c.calcOrder}</Table.Cell>}
                  <Table.Cell collapsing>
                    <Form.Input
                      value={c.unitPrice}
                      style={{ width: isTechnical ? "5rem" : "10rem" }}
                    />
                  </Table.Cell>
                  <Table.Cell collapsing>{c.unit}</Table.Cell>
                  {isTechnical && <Table.Cell collapsing>
                    <Form.Input
                      value={c.manual}
                      style={{ width: isTechnical ? "5rem" : "10rem" }}
                    />
                  </Table.Cell>}
                  {isTechnical && (
                    <Table.Cell>
                      <Form.Input value={c.calculation} />
                    </Table.Cell>
                  )}
                  {isTechnical && <Table.Cell collapsing>{c.result}</Table.Cell>}
                  {isTechnical && <Table.Cell collapsing>{c.remarks}</Table.Cell>}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <Form.Checkbox checked={c.isStatistical} />
                    </Table.Cell>
                  )}
                  {isTechnical && (
                    <Table.Cell collapsing>
                      <Form.Checkbox checked={c.isTechnical} />
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
  const [isTechnical, setIsTechnical] = useState(true);
  const permissions = session?.user?.role?.permissions || {};

  if (!permissions.displaySettings) {
    return <span>You are not authorized.</span>;
  }

  return (
    <Container text={!isTechnical}>
      <Header>Conditions</Header>
      <ConditionsTable conditions={conditions} isTechnical={isTechnical}/>
      {permissions.updateSettings && (
        <SaveButtons
          onReset={() => dispatch({ type: RESET, payload: { conditions } })}
          onSave={() => saveConditions({ conditions })}
        />
      )}
      <Form.Checkbox
        checked={isTechnical}
        onChange={(e, { checked }) => setIsTechnical(checked)}
        label="Show technical data"
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
  const conditions = await getConditions(db);

  return { props: { conditions } };
}
