import { useRouter } from "next/router";
import NextLink from "next/link";
import { Item, Flag, Label, Icon, Button, Comment, Header, Grid } from "semantic-ui-react";
import { getLogoURL } from "../utils/media";

const icons = ["eur", "usd"];

const QuotationItem = ({ quotation }) => {
  const router = useRouter();
  const { conditions = [], values, summary, createdAt, createdByFullName } = quotation;
  const printableCreatedAt = new Date(createdAt).toDateString();

  return (
    <Item>
      <Item.Image src={getLogoURL(values.logoUrl)} size="tiny" verticalAlign="middle" />
      <Item.Content verticalAlign="middle">
        <Item.Header>
          <NextLink href={`/quotation/${quotation._id}`} passHref>
            <a>
              {icons.includes(values.country) ? (
                <Icon name={values.country} />
              ) : (
                <Flag name={values.country} />
              )}{" "}
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
          {conditions
            .filter((c) => c.productCode && c.result > 0 && c.uiConfigResult?.color)
            .map((c) => (
              <Label
                key={c.name}
                color={c.uiConfigResult.color}
                icon="check circle"
                content={c.name}
              />
            ))}
          <Button
            icon
            labelPosition="right"
            floated="right"
            onClick={() => router.push(`/quotation/${quotation._id}`)}
          >
            Details
            <Icon name={quotation.values.archived ? "lock" : "right arrow"} />
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default QuotationItem;
