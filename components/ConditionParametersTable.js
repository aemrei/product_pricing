import React from "react";
import { Button, Container, Form, Header, Icon, Label, Popup, Tab, Table } from "semantic-ui-react";

function ConditionParametersTable({ params }) {
  const entries = Object.entries(params);
  const conditions = params.Conditions || []
  return (
    <Container>
      {entries.map(([name, value]) => <Label>{name}<Label.Detail>{typeof value === "object" ? "[some object]": value + ""}</Label.Detail></Label>)}
      <Table striped compact celled color="grey" size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>category</Table.HeaderCell>
            <Table.HeaderCell collapsing>name</Table.HeaderCell>
            <Table.HeaderCell collapsing>type</Table.HeaderCell>
            <Table.HeaderCell collapsing>result</Table.HeaderCell>
            <Table.HeaderCell collapsing>remarks</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {conditions.filter(({result})=>result > 0).map(({category, name, type, result, remarks}) => (
            <Table.Row>
              <Table.Cell>
                <pre>{category + ""}</pre>
              </Table.Cell>
              <Table.Cell>
                <pre>{name + ""}</pre>
              </Table.Cell>
              <Table.Cell>
                <pre>{type + ""}</pre>
              </Table.Cell>
              <Table.Cell>
                <pre>{result + ""}</pre>
              </Table.Cell>
              <Table.Cell>
                <pre>{remarks + ""}</pre>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}

export default ConditionParametersTable;
