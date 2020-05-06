import React, { PureComponent } from "react";
import TextField from "@material-ui/core/TextField";
import AttachmentIcon from "@material-ui/icons/Attachment";
import IconButton from "@material-ui/core/IconButton";

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
          <div className="text-field">
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
          </div>
          <IconButton onClick={this.props.handleFileSelect}>
            <AttachmentIcon style={{ fontSize: 30 }} />
          </IconButton>
        </form>
      </div>
    );
  }
}
