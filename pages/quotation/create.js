import { useReducer, useRef } from "react";
import {
  Container,
  Checkbox,
  Form,
  Header,
  Table,
  Segment,
  Grid,
  Ref,
  Rail,
  Sticky,
  Statistic,
  Icon,
  Divider,
  Image,
} from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB, getExchangeRates } from "../../db";
import { getCountries, getRanges, getSettings } from "../../db/settings";
import {
  quotationReducer,
  initiateQuotationState,
  SET_PRODUCT_ACTIVATION,
  SET_PROPERTY,
} from "../../utils/quotationReducer";

const DEFAULT_LOGO = "https://www.logolynx.com/images/logolynx/9a/9ac18e68c03ad7a5692da1b8c14dff58.jpeg";

const saveQuotation = async (quotationId, state) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/quotation/${quotationId}`, {
    method: "PUT",
    body: JSON.stringify(state),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createQuotation = async (state) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/quotation/`, {
    method: "POST",
    body: JSON.stringify(state),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await res.json();
  console.log({ data });
};

const Create = (props) => {
  const [state, dispatch] = useReducer(quotationReducer, initiateQuotationState(props));
  const { productSettings, values, countries, summary } = state;
  const contextRef = useRef(null);

  const toggleValue = (name) =>
    dispatch({
      type: SET_PROPERTY,
      payload: { property: name, value: !values[name] },
    });

  const setValue = (name, value) =>
    dispatch({
      type: SET_PROPERTY,
      payload: { property: name, value: value },
    });

  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column width={11}>
          <Form>
            <Header as="h2">Customer Details</Header>
            <Segment>
              <Grid>
                <Grid.Column width={6}>
                  <Image
                    fluid
                    src={values.logoUrl || DEFAULT_LOGO}
                  />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Form.Input
                    fluid
                    label="Customer Name"
                    value={values.customerName}
                    onChange={(e, { value }) => setValue("customerName", value)}
                  />
                  <Form.Select
                    label="Country of customer"
                    value={values.country}
                    placeholder="Select country where the customer is located"
                    onChange={(e, { value }) => {
                      setValue("country", value);
                    }}
                    options={countries}
                  />
                  <Form.Input
                    fluid
                    label="Logo URL"
                    placeholder="URL for company logo if exists"
                    value={values.logoUrl}
                    onChange={(e, { value }) => setValue("logoUrl", value)}
                  />
                </Grid.Column>
              </Grid>
            </Segment>
            <Header as="h2">Fit-EM Modules</Header>
            <Segment>
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
                              dispatch({
                                type: SET_PRODUCT_ACTIVATION,
                                payload: { _id: m._id, activated: !m.activated },
                              })
                            }
                          />
                        }
                      </Table.Cell>
                      <Table.Cell>{m.text}</Table.Cell>
                      <Table.Cell>{m.activated ? `${m.unit} ${m.value.toLocaleString()}` : "-"}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
            <Header as="h2">Interfaces</Header>
            <Segment>
              <Checkbox toggle checked={values.interfaceActivated} onChange={() => toggleValue("interfaceActivated")} />
              <Form.Input
                readOnly={!values.interfaceActivated}
                fluid
                label="Number of required interfaces"
                value={values.numberOfInterfaces}
                onChange={(e, { value }) => setValue("numberOfInterfaces", value)}
              />
            </Segment>
            <Header as="h2">Others</Header>
            <Segment>
              <Form.Input
                fluid
                label="Number of SAP Users"
                value={values.numberOfUsers}
                onChange={(e, { value }) => setValue("numberOfUsers", value)}
              />
              <Form.Input
                fluid
                label="Number of Legal Entities"
                value={values.numberOfLegalEntities}
                onChange={(e, { value }) => setValue("numberOfLegalEntities", value)}
              />
            </Segment>
            <Header as="h2">Summary</Header>
            <Segment.Group raised>
              <Segment>
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
                      <Table.Cell> € {summary.onetime_eur.toLocaleString()} </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Annual fee (= annual maintenance fee)</Table.Cell>
                      <Table.Cell> € {summary.annual_eur.toLocaleString()} </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Segment>
              <Segment>
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
                      <Table.Cell> € {summary.bigmac_onetime_eur.toLocaleString()} </Table.Cell>
                      <Table.Cell> $ {summary.bigmac_onetime_usd.toLocaleString()} </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Adapted Annual Maintenance fee</Table.Cell>
                      <Table.Cell> € {summary.bigmac_annual_eur.toLocaleString()} </Table.Cell>
                      <Table.Cell> $ {summary.bigmac_annual_usd.toLocaleString()} </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Segment>
            </Segment.Group>
            <Segment>
              <Header as="h4">Additional remarks</Header>
              <Form.TextArea
                value={values.additionalRemarks}
                style={{ minHeight: "8rem" }}
                onChange={(e, { value }) => setValue("additionalRemarks", value)}
              />
            </Segment>
            <SaveButtons onSave={() => createQuotation(state)} />
          </Form>
          <Ref innerRef={contextRef}>
            <Rail dividing position="right">
              <Sticky context={contextRef} bottomOffset={50} offset={50} pushing>
                <Segment textAlign="center">
                  <Statistic size="tiny" color="blue">
                    <Statistic.Value>
                      <Icon name="eur" /> {summary.bigmac_onetime_eur.toLocaleString()}
                    </Statistic.Value>
                    <Statistic.Label>License fee</Statistic.Label>
                  </Statistic>
                  <Divider />
                  <Statistic size="mini" color="orange">
                    <Statistic.Value>
                      <Icon name="eur" /> {summary.bigmac_annual_eur.toLocaleString()}
                    </Statistic.Value>
                    <Statistic.Label>Maintenance fee</Statistic.Label>
                  </Statistic>
                </Segment>
              </Sticky>
            </Rail>
          </Ref>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Create;

export async function getServerSideProps(ctx) {
  const { db } = await connectToDB();

  const countries = await getCountries(db);
  const ranges = await getRanges(db);
  const settings = await getSettings(db);
  const exchangeRates = await getExchangeRates(db);

  return { props: { countries, ranges, settings, exchangeRates } };
}
