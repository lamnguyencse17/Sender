import React, { PureComponent } from "react";
import TextField from "@material-ui/core/TextField";

export default class TextInput extends PureComponent {
  render() {
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="filled-multiline-static"
          multiline
          rows={1}
          fullWidth={true}
          variant="filled"
          onChange={this.props.updateText}
        />
      </form>
    );
  }
}
