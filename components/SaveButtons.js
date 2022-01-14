import {
  Button, Icon,
} from "semantic-ui-react";

export default function SaveButtons({onSave, onReset, onRun}) {
  return (
    <Button.Group widths='3'>
      {onRun && <Button type="button" onClick={onRun}><Icon name="play" /> Simulate</Button>}
      {onSave && <Button type="button" onClick={onReset}><Icon name="repeat" /> Reset</Button>}
      {onReset && <Button type="button" positive onClick={onSave}><Icon name="save" /> Save</Button>}
    </Button.Group>
  );
}