import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
export default class ActiveBar extends Component {
  constructor(props) {
    super(props);
    let indexDict = {};
    let index = 0;
    Object.keys(this.props.room).forEach((key) => {
      indexDict[index] = key;
      index = index + 1;
    });
    this.state = {
      value: 0,
      indexDict,
    };
  }
  handleChange = (event, value) => {
    console.log(this.state.indexDict[value]);
    this.setState({ ...this.state, value: value });
    this.props.setActiveTab(this.state.indexDict[value]);
  };
  render() {
    return (
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={this.state.value}
        onChange={this.handleChange}
        aria-label="Vertical tabs example"
      >
        {Object.keys(this.props.room).map((index) => {
          return <Tab key={index} label={index} {...a11yProps(index)} />;
        })}
      </Tabs>
    );
  }
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}
