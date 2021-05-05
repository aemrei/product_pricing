import {
  Container,
  Header,
  Input,
  Table,
} from "semantic-ui-react";
import SaveButtons from "../../components/SaveButtons";
import { getInterfaceFees } from "../../db/settings";

export default function InterfacePage({interfaceFees}){
  return (
    <Container>
      <Header>Price per Interface</Header>
      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell collapsing>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Base price for CAT-Interfaces</Table.Cell>
            <Table.Cell>
              <Input label="€" defaultValue={100000}/>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Table striped compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>From</Table.HeaderCell>
            <Table.HeaderCell collapsing>To</Table.HeaderCell>
            <Table.HeaderCell collapsing>Price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
        {
          interfaceFees.map(e =>
            <Table.Row key={e._id}>
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
  const interfaceFees = await getInterfaceFees();

  return { props: { interfaceFees } };
}