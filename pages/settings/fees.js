import {
  Container,
  Header,
  Input,
  Table,
} from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { getFees } from "../../db/settings";

export default function FeePage({fees}){
  return (
    <Container>
      <Header>Other Fees</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell collapsing>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {
          fees.map(e =>
            <Table.Row key={e._id}>
              <Table.Cell>{e.text}</Table.Cell>
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
  const fees = await getFees();

  return { props: { fees } };
}