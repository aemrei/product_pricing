import {
  Container,
  Checkbox,
  Form,
  Header,
  Table,
} from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { getCountries, getProducts } from "../../db/settings";

const Create = ({countries, modules }) => {
  return (
    <Container>
      <Form>
        <Header as="h2">Customer Details</Header>
        <Form.Input label="Customer Name"/>
        <Form.Select label='Country of customer' defaultValue="Euro area" placeholder="Select country where the customer is located" options={countries} />
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
          {
            modules.map(m =>
              <Table.Row key={m._id}>
                <Table.Cell collapsing>
                  {!m.readOnly && <Checkbox slider readOnly={m.readOnly}/>}
                </Table.Cell>
                <Table.Cell>{m.text}</Table.Cell>
                <Table.Cell>{m.currency} {m.price}</Table.Cell>
              </Table.Row>
            )
          }
          </Table.Body>
        </Table>
        <Header as="h2">Interfaces</Header>
        <Form.Input label="Number of required interfaces"/>
        <Form.Input label="Number of SAP Users"/>
        <Form.Input label="Number of Legal Entities"/>

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
              <Table.Cell>
                One-time-charge (including first year maintenance fee)
              </Table.Cell>
              <Table.Cell> € 4,371,400 </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Annual fee (= annual maintenance fee)
              </Table.Cell>
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
              <Table.Cell>
                Adapted License fee
              </Table.Cell>
              <Table.Cell> € 4,371,400 </Table.Cell>
              <Table.Cell> $5,251,236 </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                Adapted Annual Maintenance fee
              </Table.Cell>
              <Table.Cell> € 961,708 </Table.Cell>
              <Table.Cell> $1,155,272 </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Header as="h4">Additional remarks</Header>
        <Form.TextArea style={{minHeight: "8rem" }}/>

        <SaveButtons/>
      </Form>
    </Container>
  )
}

export default Create;


export async function getStaticProps(ctx) {
  const countries = await getCountries();
  const modules = await getProducts();

  return { props: { countries, modules } };
}