import { Fragment, useReducer, useRef } from "react";
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
  Message,
} from "semantic-ui-react";
import SaveButtons from "./SaveButtons";
import ProductCodeTable from "./ProductCodeTable";
import {
  quotationReducer,
  initiateQuotationState,
  SET_CONDITION,
  SET_PROPERTY,
  RESET,
} from "../utils/quotationReducer";
import { getLogoURL } from "../utils/media";
import { useSession } from "next-auth/client";
import SmartField from "./SmartField";

function convertConditionsToJSON(obj) {
  return JSON.stringify(obj, (key, value) => {
    return key === "_input" ? undefined : value;
  });
}

const modifyQuotation = async (state) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/quotation/`, {
    method: state._id ? "PUT" : "POST",
    body: convertConditionsToJSON(state),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await res.json();
  console.log({ data });
  return data;
};

function getSections(conditions) {
  const sections = [];
  conditions.forEach((c) => {
    const sectionName = c?.uiConfigResult?.section || "Others";
    let section = sections.find((s) => s.name === sectionName);
    if (!section) {
      section = { name: sectionName, items: [] };
      sections.push(section);
    }
    section.items.push(c);
  });
  return sections;
}

const QuotationDetail = (props) => {
  const [session, loading] = useSession();
  const role = session?.user?.role || {};
  const [state, dispatch] = useReducer(
    quotationReducer,
    { ...props, settings: props.settings || props.productSettings, role },
    initiateQuotationState,
  );
  const { conditions, values, countries, exchanges, summary } = state;
  const bigMacRate = countries.find((c) => c._id === values.country);
  const dollar_rate = exchanges.usd;
  const calculatedAt = props.updatedAt ? new Date(props.updatedAt) : new Date();
  const printableUpdatedAt = calculatedAt.toDateString();
  const contextRef = useRef(null);
  const router = useRouter();
  const permissions = role.permissions || {};
  const sections = getSections(conditions.filter((c) => c.category === "UI"));
  const enableModifications = state._id
    ? permissions.updateItem && !props.values.archived
    : permissions.createItem;

  if (!state._id && !permissions.createItem) {
    return <span>You are not authorized.</span>;
  }

  const setValue = (name, value) =>
    enableModifications &&
    dispatch({
      type: SET_PROPERTY,
      payload: { property: name, value: value },
    });

  const setCondition = (condition) => {
    enableModifications &&
      dispatch({
        type: SET_CONDITION,
        payload: condition,
      });
  };

  const availableCurrencies = summary?.offerCurrency?.uiConfigResult?.items || [];
  const selectedKey = summary?.offerCurrency?.result;
  const selectedCurrency = availableCurrencies.find((c) => c.key === selectedKey) || {
    key: 1,
    text: "USD",
    icon: "dollar",
  };

  return (
    <Container>
      <Grid columns={2}>
        <Grid.Column width={11}>
          <Form>
            <Header as="h2">Customer Info</Header>
            <Segment>
              <Grid>
                <Grid.Column width={4}>
                  <Image fluid src={getLogoURL(values.logoUrl)} />
                </Grid.Column>
                <Grid.Column width={12}>
                  <Form.Input
                    readOnly={!enableModifications}
                    fluid
                    label="Customer Name"
                    value={values.customerName}
                    onChange={(e, { value }) => setValue("customerName", value)}
                  />
                  <Form.Dropdown
                    button
                    search={enableModifications}
                    readOnly={!enableModifications}
                    label="Country of customer"
                    value={values.country}
                    placeholder="Select country where the customer is located"
                    onChange={(e, { value }) => {
                      setValue("country", value);
                    }}
                    options={countries}
                  />
                  <Form.Input
                    readOnly={!enableModifications}
                    fluid
                    label="Logo URL"
                    placeholder="URL for company logo if exists"
                    value={values.logoUrl}
                    onChange={(e, { value }) => setValue("logoUrl", value)}
                  />
                </Grid.Column>
              </Grid>
            </Segment>
            {sections.map((s) => (
              <Fragment key={s.name}>
                <Header as="h2">{s.name}</Header>
                <Table striped compact celled color="orange">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {s.items.map((c) => (
                      <Table.Row key={c._id}>
                        <Table.Cell>{c.remarks}</Table.Cell>
                        <Table.Cell>
                          <SmartField
                            condition={c}
                            setCondition={setCondition}
                            readOnly={!enableModifications}
                          />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Fragment>
            ))}
            <Header as="h2">Summary</Header>
            <Segment.Group raised>
              <Segment>
                <ProductCodeTable conditions={conditions} icon={selectedCurrency.icon} />
                <Table striped compact celled color="grey">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Prices</Table.HeaderCell>
                      <Table.HeaderCell>Total</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>One-time charge</Table.Cell>
                      <Table.Cell>
                        <Icon name={selectedCurrency.icon} />{" "}
                        {summary.subtotal_onetime_conv.toLocaleString()}{" "}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Annual Fee</Table.Cell>
                      <Table.Cell>
                        <Icon name={selectedCurrency.icon} />{" "}
                        {summary.subtotal_annual_conv.toLocaleString()}{" "}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <Table striped compact celled color="green">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>BigMac corrected {summary.discountAmount.result && `after discount` || null}</Table.HeaderCell>
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
                readOnly={!enableModifications}
                value={values.additionalRemarks}
                style={{ minHeight: "8rem" }}
                onChange={(e, { value }) => setValue("additionalRemarks", value)}
              />
            </Segment>
            {permissions.archiveItem && (
              <Segment>
                <Checkbox
                  label="Complete and archive this document"
                  checked={values.archived}
                  onChange={(e, { checked }) => setValue("archived", checked)}
                />
                {values.archived && enableModifications && (
                  <Message header="This will make this document read-only." />
                )}
              </Segment>
            )}
            {enableModifications && (
              <SaveButtons
                onSave={() =>
                  modifyQuotation(state).then((quotation) =>
                    router.push(`/quotation/${quotation._id}`),
                  )
                }
                onReset={() =>
                  enableModifications && dispatch({ type: RESET, payload: { ...props, role } })
                }
              />
            )}
          </Form>
          <Ref innerRef={contextRef}>
            <Rail dividing position="right" style={{ zIndex: 9 }}>
              <Sticky context={contextRef} bottomOffset={50} offset={70} pushing>
                <Segment textAlign="center">
                  <Statistic size="tiny" color="blue">
                    <Statistic.Value>
                      <Icon name={selectedCurrency.icon} />{" "}
                      {summary.bigmac_onetime_conv.toLocaleString()}
                    </Statistic.Value>
                    <Statistic.Label>License fee</Statistic.Label>
                  </Statistic>
                  <Divider />
                  <Statistic size="mini" color="orange">
                    <Statistic.Value>
                      <Icon name={selectedCurrency.icon} />{" "}
                      {summary.bigmac_annual_conv.toLocaleString()}
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

export default QuotationDetail;
