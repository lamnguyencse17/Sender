import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import NewRoomModal from "./NewRoomModal";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";

class ActiveBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      room: this.props.room,
      addNewRoom: false,
    };
  }
  handleChange = (event, value) => {
    this.setState({ ...this.state, value: value });
    this.props.setActiveTab(value);
  };
  shouldComponentUpdate(nextProps, nextStates) {
    if (this.state.value != nextStates.value) {
      return true;
    }
    if (this.state.addNewRoom != nextStates.addNewRoom) {
      return true;
    }
    if (nextProps.room.sort().toString() == this.state.room.sort().toString()) {
      return false;
    }
    return true;
  }
  toggleNewRoomModal = () => {
    console.log(this.state);
    this.setState({ ...this.state, addNewRoom: !this.state.addNewRoom });
  };
  render() {
    return (
      <>
        <NewRoomModal
          open={this.state.addNewRoom}
          closeModal={this.toggleNewRoomModal}
          addNewRoom={this.props.addNewRoom}
        />
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={this.state.value}
          onChange={this.handleChange}
          aria-label="Vertical tabs example"
        >
          {this.props.room.map((value) => {
            return (
              <Tab
                key={value}
                label={value}
                id={`vertical-tab-${value}`}
                aria-controls={`vertical-tabpanel-${value}`}
              />
            );
          })}
        </Tabs>
        <IconButton onClick={this.toggleNewRoomModal}>
          <AddCircleIcon />
        </IconButton>
      </>
    );
  }
}

ActiveBar.propTypes = {
  room: PropTypes.array.isRequired,
};

export default ActiveBar;
