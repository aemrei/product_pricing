import { useReducer, useRef } from "react";
import { Container, Checkbox, Form, Header, Table, Segment, Grid, Ref, Rail, Sticky } from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { connectToDB } from "../../db";
import { getCountries, getRanges, getSettings } from "../../db/settings";
import {
  quotationReducer,
  initiateQuotationState,
  SET_PRODUCT_ACTIVATION,
  SET_PROPERTY,
} from "../../utils/quotationReducer";

const Create = (props) => {
  const [state, dispatch] = useReducer(quotationReducer, initiateQuotationState(props));
  const { productSettings, values, countries, summary, settingsAsObject } = state;
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
        <Grid.Column width={10}>
          <Form>
            <Header as="h2">Customer Details</Header>
            <Segment>
              <Form.Input
                fluid
                label="Customer Name"
                value={values.customerName}
                onChange={(e) => setValue("customerName", e.target.value)}
              />
              <Form.Select
                label="Country of customer"
                value={values.country}
                placeholder="Select country where the customer is located"
                onChange={(e) => setValue("country", e.target.value)}
                options={countries}
              />
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
                      <Table.Cell>{m.activated ? `${m.unit} ${m.value}` : "-"}</Table.Cell>
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
                onChange={(e) => setValue("numberOfInterfaces", e.target.value)}
              />
            </Segment>
            <Header as="h2">Others</Header>
            <Segment>
              <Form.Input
                fluid
                label="Number of SAP Users"
                value={values.numberOfUsers}
                onChange={(e) => setValue("numberOfUsers", e.target.value)}
              />
              <Form.Input
                fluid
                label="Number of Legal Entities"
                value={values.numberOfLegalEntities}
                onChange={(e) => setValue("numberOfLegalEntities", e.target.value)}
              />
            </Segment>
            <Segment>
              <Header as="h4">Additional remarks</Header>
              <Form.TextArea
                value={values.additionalRemarks}
                style={{ minHeight: "8rem" }}
                onChange={(e) => setValue("additionalRemarks", e.target.value)}
              />
            </Segment>
          </Form>
          <Ref innerRef={contextRef}>
            <Rail dividing position="right">
              <Sticky context={contextRef} bottomOffset={50} offset={50} pushing>
                <Form>
                  <Header as="h">Summary</Header>
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
                            <Table.Cell> € {summary.onetime_eur} </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Annual fee (= annual maintenance fee)</Table.Cell>
                            <Table.Cell> € {summary.annual_eur} </Table.Cell>
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
                            <Table.Cell> € {summary.bigmac_onetime_eur} </Table.Cell>
                            <Table.Cell> $ {summary.bigmac_onetime_usd} </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>Adapted Annual Maintenance fee</Table.Cell>
                            <Table.Cell> € {summary.bigmac_annual_eur} </Table.Cell>
                            <Table.Cell> $ {summary.bigmac_annual_usd} </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table>
                    </Segment>
                  </Segment.Group>

                  <SaveButtons />
                </Form>
              </Sticky>
            </Rail>
          </Ref>
        </Grid.Column>
      </Grid>
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
