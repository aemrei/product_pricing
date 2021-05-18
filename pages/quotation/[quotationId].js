import { getSession } from "next-auth/client";
import { useRef } from "react";
import {
  Checkbox,
  Container,
  Divider,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Rail,
  Ref,
  Segment,
  Statistic,
  Sticky,
  Table,
} from "semantic-ui-react";
import { connectToDB, getQuotationById } from "../../db";

const DEFAULT_LOGO = "https://www.logolynx.com/images/logolynx/9a/9ac18e68c03ad7a5692da1b8c14dff58.jpeg";

export default function QuotationDetail({ quotation }) {
  const { productSettings, values, countries, summary, createdAt, createdBy, createdByFullName } = quotation;
  const printableCreatedAt = new Date(createdAt).toDateString();
  const contextRef = useRef(null);
  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column width={11}>
          <Form>
            <Header as="h2">Customer Details</Header>
            <Segment>
              <Grid>
                <Grid.Column width={6}>
                  <Image fluid src={values.logoUrl || DEFAULT_LOGO} />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Form.Input fluid transparent readOnly label="Customer Name" value={values.customerName} />
                  <Form.Select
                    label="Country of customer"
                    value={values.country}
                    readOnly
                    placeholder="Select country where the customer is located"
                    options={countries}
                  />
                  <Form.Input
                    fluid
                    transparent
                    readOnly
                    label="Created By"
                    value={`${createdByFullName} (${createdBy}) at ${printableCreatedAt}`}
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
                      <Table.Cell collapsing>{<Checkbox toggle readOnly checked={m.activated} />}</Table.Cell>
                      <Table.Cell>{m.text}</Table.Cell>
                      <Table.Cell>{m.activated ? `${m.unit} ${m.value.toLocaleString()}` : "-"}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Segment>
            <Header as="h2">Interfaces</Header>
            <Segment>
              <Checkbox toggle checked={values.interfaceActivated} />
              <Form.Input
                transparent
                readOnly
                fluid
                label="Number of required interfaces"
                value={values.numberOfInterfaces}
              />
            </Segment>
            <Header as="h2">Others</Header>
            <Segment>
              <Form.Input transparent readOnly fluid label="Number of SAP Users" value={values.numberOfUsers} />
              <Form.Input
                transparent
                readOnly
                fluid
                label="Number of Legal Entities"
                value={values.numberOfLegalEntities}
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
              <Form.TextArea readOnly value={values.additionalRemarks} style={{ minHeight: "8rem" }} />
            </Segment>
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
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session || !session.user) {
    return { props: {} };
  }

  const { db } = await connectToDB();
  const quotation = await getQuotationById(db, ctx.params.quotationId);

  return { props: { quotation } };
}
