import { Table } from "semantic-ui-react";

export default function ProductCodeTable({ conditions }) {
  const visibleConditions = conditions.filter((c) => c.productCode && c.type === "Subtotal");

  return (
    <Table striped compact celled color="olive">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Product Code</Table.HeaderCell>
          <Table.HeaderCell>Product Name</Table.HeaderCell>
          <Table.HeaderCell>Sub Totals</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {visibleConditions.map((c) => (
          <Table.Row key={c._id}>
            <Table.Cell>{c.productCode}</Table.Cell>
            <Table.Cell>{c.name}</Table.Cell>
            <Table.Cell>€ {c.result.toLocaleString()}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
