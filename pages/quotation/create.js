import { useReducer, useRef } from "react";
import { useRouter } from "next/router";
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
  RESET,
} from "../../utils/quotationReducer";
import { getLogoURL } from "../../utils/media";
import { useSession } from "next-auth/client";

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
  return data;
};

const Create = (props) => {
  const [session, loading] = useSession();
  const role = session?.user?.role || {};
  const [state, dispatch] = useReducer(quotationReducer, { ...props, role }, initiateQuotationState);
  const { productSettings, values, countries, exchangeRates, summary } = state;
  const bigMacRate = countries.find((c) => c._id === values.country);
  const dollar_rate = exchangeRates.find((c) => c.code === "USD");
  const printableUpdatedAt = new Date().toDateString();
  const contextRef = useRef(null);
  const router = useRouter();
  const permissions = role.permissions || {};

  if (!permissions.createItem) {
    return <span>You are not authorized.</span>;
  }

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
                <Grid.Column width={4}>
                  <Image fluid src={getLogoURL(values.logoUrl)} />
                </Grid.Column>
                <Grid.Column width={12}>
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
                    {/* <Table.HeaderCell>Price</Table.HeaderCell> */}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {productSettings
                    .filter((x) => x.order)
                    .map((m) => (
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
                        {/* <Table.Cell>{m.activated ? `${m.unit} ${m.value.toLocaleString()}` : "-"}</Table.Cell> */}
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </Segment>
            <Header as="h2">Interfaces</Header>
            <Segment>
              <Checkbox toggle checked={values.interfaceActivated} onChange={() => toggleValue("interfaceActivated")} />
              <Form.Input
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
              <Form.Input
                fluid
                label={`Discount percentage (max: ${role.maxDiscountPercent} %)`}
                value={values.discountPercentage}
                onChange={(e, { value }) => setValue("discountPercentage", value)}
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
            <SaveButtons
              onSave={() => createQuotation(state).then((quotation) => router.push(`/quotation/${quotation._id}`))}
              onReset={() => dispatch({ type: RESET, payload: { ...props, role } })}
            />
          </Form>
          <Ref innerRef={contextRef}>
            <Rail dividing position="right" style={{ zIndex: 9 }}>
              <Sticky context={contextRef} bottomOffset={50} offset={70} pushing>
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
                <Table>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Calculation Date</Table.Cell>
                      <Table.Cell> {printableUpdatedAt} </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>USD rate</Table.Cell>
                      <Table.Cell> {dollar_rate.rate.toFixed(2)} </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>BigMac Ratio</Table.Cell>
                      <Table.Cell> {bigMacRate.euro_ratio.toFixed(2)} </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
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
