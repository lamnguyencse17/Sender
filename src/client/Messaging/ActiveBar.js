import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
export default class ActiveBar extends Component {
  constructor(props) {
    super(props);
    let indexDict = {};
    let index = 0;
    this.props.room.forEach((value) => {
      indexDict[index] = value;
      index = index + 1;
    });
    // Object.keys(this.props.room).forEach((key) => {
    //   indexDict[index] = key;
    //   index = index + 1;
    // });
    this.state = {
      value: 0,
      indexDict,
    };
  }
  handleChange = (event, value) => {
    this.setState({ ...this.state, value: value });
    this.props.setActiveTab(this.state.indexDict[value]);
  };
  shouldComponentUpdate(nextProps, nextState) {
    let props = Object.keys(nextProps.room).sort();
    let state = Object.values(nextState.indexDict).sort();
    if (!props.toString() == state.toString()) {
      return false;
    } else if (nextProps.room.sort().toString() == state.toString()) {
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
