import { useRouter } from "next/router";
import NextLink from "next/link";
import { Item, Flag, Label, Icon, Button, Comment, Header, Grid } from "semantic-ui-react";
import { getLogoURL } from "../utils/media";

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
  const router = useRouter();
  const { productSettings, values, summary, createdAt, createdByFullName } = quotation;
  const printableCreatedAt = new Date(createdAt).toDateString();

  return (
    <Item>
      <Item.Image src={getLogoURL(values.logoUrl)} size="tiny" verticalAlign="middle" />
      <Item.Content verticalAlign="middle">
        <Item.Header>
          <NextLink href={`/quotation/${quotation._id}`} passHref>
            <a>
              {icons.includes(values.country) ? <Icon name={values.country} /> : <Flag name={values.country} />}{" "}
              {values.customerName}
            </a>
          </NextLink>
        </Item.Header>

        <Item.Meta>
          {createdByFullName} at {printableCreatedAt}
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
          <Button icon labelPosition="right" floated="right" onClick={() => router.push(`/quotation/${quotation._id}`)}>
            Details
            <Icon name={quotation.values.archived ? "lock" : "right arrow"} />
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default QuotationItem;
