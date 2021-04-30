import {
  Container,
  Header,
  Input,
  Table,
} from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { getUserFees } from "../../db/settings";

export default function UserPage({userFees}){
  return (
    <Container>
      <Header>Price per User</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>From</Table.HeaderCell>
            <Table.HeaderCell>To</Table.HeaderCell>
            <Table.HeaderCell collapsing>Price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {
          userFees.map(e =>
            <Table.Row key={e.key}>
              <Table.Cell>
              <Input defaultValue={e.lowerLimit}/>
              </Table.Cell>
              <Table.Cell>
              <Input defaultValue={e.upperLimit}/>
              </Table.Cell>
              <Table.Cell>
                <Input label={e.icon} defaultValue={e.value}/>
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
  const userFees = await getUserFees();

  return { props: { userFees } };
}