import React from "react";
import { Form, Input } from "semantic-ui-react";

function DropdownField({ condition, setCondition, readOnly, withLabel = undefined }) {
  const { remarks, uiConfigResult } = condition;
  const options = uiConfigResult?.items?.map((i) => ({ ...i, value: +i.key })) || [];
  return (
    <Form.Dropdown
      readOnly={readOnly}
      button
      label={withLabel && remarks}
      options={options}
      value={condition.manual || 0}
      onChange={(e, { value }) => setCondition({ ...condition, manual: value })}
      search={!readOnly}
    />
  );
}

function NumericField({ condition, setCondition, readOnly }) {
  const { remarks } = condition;
  return (
    <Input
      readOnly={readOnly}
      fluid
      label={condition.unit || null}
      value={condition.manual || ""}
      onChange={(e, { value }) => setCondition({ ...condition, manual: value })}
    />
  );
}

function SwitchField({ condition, setCondition, readOnly, withLabel = undefined }) {
  const { remarks, manual } = condition;
  return (
    <Form.Checkbox
      toggle
      readOnly={readOnly}
      checked={!!manual}
      label={withLabel && remarks}
      onChange={(e, { checked }) => setCondition({ ...condition, manual: +checked })}
    />
  );
}

function SmartField({ condition, setCondition, readOnly }) {
  if (condition.type === "INPUT") {
    return <NumericField condition={condition} setCondition={setCondition} readOnly={readOnly} />;
  }
  if (condition.type === "SWITCH") {
    return <SwitchField condition={condition} setCondition={setCondition} readOnly={readOnly} />;
  }
  if (condition.type === "DROPDOWN") {
    return <DropdownField condition={condition} setCondition={setCondition} readOnly={readOnly} />;
  }
  return null;
}

export default SmartField;
