import {
  Button,
} from "semantic-ui-react";

export default function SaveButtons() {
  return (
    <Button.Group widths='2'>
      <Button>Cancel</Button>
      <Button positive>Save</Button>
    </Button.Group>
  );
}