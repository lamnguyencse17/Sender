import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
export default class ActiveBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      room: this.props.room,
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
    if (nextProps.room.sort().toString() == this.state.room.sort().toString()) {
      return false;
    }
    return true;
  }
  render() {
    return (
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
    );
  }
}
