import {
  Container,
  Header,
  Input,
  Table,
} from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { getProducts } from "../../db/settings";

export default function ProductPage({products}){
  return (
    <Container>
      <Header>Product Prices</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell collapsing>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {
          products.map(e =>
            <Table.Row key={e._id}>
              <Table.Cell>{e.text}</Table.Cell>
              <Table.Cell>
                <Input label={e.currency} defaultValue={e.price}/>
              </Table.Cell>
            </Table.Row>
          )
        }
        </Table.Body>
      </Table>
      <SaveButtons/>
    </Container>
  )
}

export async function getStaticProps(ctx) {
  const products = await getProducts();

  return { props: { products } };
}