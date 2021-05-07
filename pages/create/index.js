import { useReducer } from "react";
import { Container, Checkbox, Form, Header, Table } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db";
import { getCountries, getRanges, getSettings } from "../../db/settings";
import { quotationReducer, initiateQuotationState, SET_PRODUCT_ACTIVATION } from "../../utils/quotationReducer";

const Create = (props) => {
  const [state, dispatch] = useReducer(quotationReducer, initiateQuotationState(props));
  const { productSettings, ranges, countries } = state;

  return (
    <Container>
      <Form>
        <Header as="h2">Customer Details</Header>
        <Form.Input label="Customer Name" />
        <Form.Select
          label="Country of customer"
          defaultValue="Euro area"
          placeholder="Select country where the customer is located"
          options={countries}
        />
        <Header as="h2">Fit-EM Modules</Header>
        Customer wants to buy:
        <Table striped compact celled color="orange">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Module</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {productSettings.map((m) => (
              <Table.Row key={m._id}>
                <Table.Cell collapsing>
                  {
                    <Checkbox
                      toggle
                      readOnly={m.readOnly}
                      checked={m.activated}
                      onChange={() =>
                        dispatch({ type: SET_PRODUCT_ACTIVATION, payload: { _id: m._id, activated: !m.activated } })
                      }
                    />
                  }
                </Table.Cell>
                <Table.Cell>{m.text}</Table.Cell>
                <Table.Cell>{m.activated ? `${m.unit} ${m.value}` : "-"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Header as="h2">Interfaces</Header>
        <Form.Input label="Number of required interfaces" />
        <Form.Input label="Number of SAP Users" />
        <Form.Input label="Number of Legal Entities" />
        <Header as="h2">Summary</Header>
        <Table striped compact celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Euro</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>One-time-charge (including first year maintenance fee)</Table.Cell>
              <Table.Cell> € 4,371,400 </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Annual fee (= annual maintenance fee)</Table.Cell>
              <Table.Cell> € 961,708 </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Table striped compact celled color="green">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>BigMac corrected</Table.HeaderCell>
              <Table.HeaderCell>Euro</Table.HeaderCell>
              <Table.HeaderCell>Dollar</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Adapted License fee</Table.Cell>
              <Table.Cell> € 4,371,400 </Table.Cell>
              <Table.Cell> $5,251,236 </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Adapted Annual Maintenance fee</Table.Cell>
              <Table.Cell> € 961,708 </Table.Cell>
              <Table.Cell> $1,155,272 </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Header as="h4">Additional remarks</Header>
        <Form.TextArea style={{ minHeight: "8rem" }} />
        <SaveButtons />
      </Form>
    </Container>
  );
};

export default Create;

export async function getStaticProps(ctx) {
  const { db } = await connectToDB();

  const countries = await getCountries(db);
  const ranges = await getRanges(db);
  const settings = await getSettings(db);

  return { props: { countries, ranges, settings } };
}
