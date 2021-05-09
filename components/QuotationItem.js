import { Item, Flag, Label, Icon, Button, Comment, Header, Grid } from "semantic-ui-react";

const icons = ["eur", "usd"];
const PRODUCT_COLORS = {
  "Fit-Prime": "orange",
  "Fit-Parts": "yellow",
  "Fit-Service": "teal",
  "Fit-Rent": "violet",
  "Fit-Lease": "pink",
  "Fit-Fleet": "grey",
};

const QuotationItem = ({ quotation }) => {
  const { productSettings, values, summary, createdAt, createdBy } = quotation;
  console.log({ quotation });
  return (
    <Item>
      <Item.Image src={values.logoUrl} />
      <Item.Content>
        <Item.Header as="a">
          {icons.includes(values.country) ? <Icon name={values.country} /> : <Flag name={values.country} />}{" "}
          {values.customerName}
        </Item.Header>
        <Item.Meta>
          {createdBy} at {createdAt}
        </Item.Meta>
        <Item.Description>
          <Grid>
            <Grid.Column width={9}>{values.additionalRemarks}</Grid.Column>
            <Grid.Column width={2}>
              <Header sub>License</Header>
              <span>€ {summary.bigmac_onetime_eur.toLocaleString()}</span>
            </Grid.Column>
            <Grid.Column width={2}>
              <Header sub>Maintenance</Header>
              <span>€ {summary.bigmac_annual_eur.toLocaleString()}</span>
            </Grid.Column>
          </Grid>
        </Item.Description>
        <Item.Extra>
          {productSettings
            .filter((p) => p.activated && p._id !== "base")
            .map((p) => (
              <Label key={p._id} color={PRODUCT_COLORS[p._id]} icon="check circle" content={p.text} />
            ))}
          <Button primary floated="right">
            Details
            <Icon name="right chevron" />
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default QuotationItem;
