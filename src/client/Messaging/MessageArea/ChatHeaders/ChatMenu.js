import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const options = ["Dione", "Ganymede", "Hangouts Call"];

const ITEM_HEIGHT = 48;

export default class LongMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
      selected: null,
    };
  }
  handleClick = (event) => {
    console.log(event.currentTarget.value);
    this.setState({ anchor: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchor: null });
  };
  render() {
    let { anchor } = this.state;
    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchor}
          keepMounted
          open={Boolean(anchor)}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          {options.map((option) => (
            // Handle Menu Click Here
            <MenuItem
              key={option}
              onClick={() => this.setState({ ...this.state, selected: option })}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}
