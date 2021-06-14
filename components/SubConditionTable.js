import { Input, Table } from "semantic-ui-react";

export default function SubConditionTable({ categories, conditions, setCondition, readOnly }) {
  const visibleCategories = [].concat(categories);
  const relatedConditions = conditions
    .filter((c) => visibleCategories.includes(c.category) && c.order && c.type)
    .sort((a, b) => a.order - b.order);

  const rows = [...new Set(relatedConditions.map((rlt) => rlt.name))];
  const columns = [...new Set(relatedConditions.map((rlt) => rlt.type))];

  return (
    <Table striped compact celled color="orange">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          {columns.map((c) => (
            <Table.HeaderCell key={c}>{c}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((r) => (
          <Table.Row key={r}>
            <Table.Cell>{r}</Table.Cell>
            {columns.map((c) => {
              const condition = relatedConditions.find((rlt) => rlt.name === r && rlt.type === c);
              if (!condition) {
                return <Table.Cell key={c} />;
              }
              return (
                <Table.Cell key={c}>
                  <Input
                    fluid
                    label={condition.unit || null}
                    readOnly={readOnly}
                    value={condition.manual}
                    onChange={(e, { value }) => setCondition({ ...condition, manual: value })}
                  />
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
