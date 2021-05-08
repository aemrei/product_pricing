import {
  Button, Icon,
} from "semantic-ui-react";

export default function SaveButtons({onSave, onReset}) {
  return (
    <Button.Group widths='2'>
      <Button onClick={onReset}><Icon name="repeat" /> Reset</Button>
      <Button positive onClick={onSave}><Icon name="save" /> Save</Button>
    </Button.Group>
  );
}