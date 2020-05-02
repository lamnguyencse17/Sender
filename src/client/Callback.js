import React, { Component } from "react";
import axios from "axios";

export default class Callback extends Component {
  componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  }
  render() {
    return <></>;
  }
}
