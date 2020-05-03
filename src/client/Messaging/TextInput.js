import React, { PureComponent } from "react";
import TextField from "@material-ui/core/TextField";

export default class TextInput extends PureComponent {
  constructor() {
    super();
    this.state = {
      inputValue: "",
    };
  }
  checkKey = (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
      this.props.sendMessage(this.state.inputValue);
      this.setState({ inputValue: "" });
    }
  };
  render() {
    return (
      <div className="text-area">
        <form noValidate autoComplete="off">
          <TextField
            id="filled-text-input-static"
            fullWidth={true}
            variant="filled"
            onChange={(e) => {
              this.setState({ inputValue: e.target.value });
            }}
            onKeyPress={this.checkKey}
            type="string"
            value={this.state.inputValue}
          />
        </form>
      </div>
    );
  }
}
