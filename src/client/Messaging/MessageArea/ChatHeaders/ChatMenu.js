import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ParticipantsModal from "./Modals/ParticipantsModal";
import ConfirmationLeaveModal from "./Modals/ConfirmationLeave"
const options = ["Show Participants", "Leave room"];

const ITEM_HEIGHT = 48;

export default class LongMenu extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      anchor: null,
      selected: null,
      participantModal: false,
      confirmationModal: false
    };
  }
  handleClick = (event) => {
    this.setState({ anchor: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchor: null });
  };
  closeParticipantModal = () => {
    this.setState({ ...this.state, participantModal: false });
  };
  closeConfirmationLeave = () => {
    this.setState({ ... this.state, confirmationModal: false})
  }
  render() {
    let { anchor } = this.state;
    return (
      <div>
        <ParticipantsModal
          open={this.state.participantModal}
          closeModal={this.closeParticipantModal}
          participants={this.props.participants}
        />
        <ConfirmationLeaveModal open={this.state.confirmationModal}
          closeModal={this.closeConfirmationLeave}
          roomId={this.props.roomId}
          updateOnUserLeave={this.props.updateOnUserLeave}
          />
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
              onClick={() =>
                option == "Show Participants"
                  ? this.setState({
                      ...this.state,
                      selected: option,
                      participantModal: true,
                    })
                  : this.setState({
                    ...this.state,
                    selected: option,
                    confirmationModal: true,
                  })
              }
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}
