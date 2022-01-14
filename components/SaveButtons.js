import {
  Button, Icon,
} from "semantic-ui-react";

export default function SaveButtons({onAdd, onSave, onReset, onRun, onTextMode}) {
  return (
    <Button.Group widths='6'>
      {onAdd && <Button type="button" onClick={onAdd}><Icon name="add" /> Add line</Button>}
      {onRun && <Button type="button" onClick={onRun}><Icon name="play" /> Simulate</Button>}
      {onReset && <Button type="button" onClick={onReset}><Icon name="repeat" /> Reset</Button>}
      {onTextMode && <Button type="button" onClick={onTextMode}><Icon name="edit outline" /> Edit in TextMode</Button>}
      {onSave && <Button type="button" positive onClick={onSave}><Icon name="save" /> Save</Button>}
    </Button.Group>
  );
}