import React, { PureComponent } from "react";
import TextField from "@material-ui/core/TextField";

export default class TextInput extends PureComponent {
  checkKey = (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      this.props.sendMessage("everyone");
    }
  };
  render() {
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="filled-text-input-static"
          fullWidth={true}
          variant="filled"
          onChange={this.props.updateText}
          onKeyPress={this.checkKey}
          type="string"
        />
      </form>
    );
  }
}
