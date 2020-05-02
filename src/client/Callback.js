import React, { Component } from "react";
import axios from "axios";

export default class Callback extends Component {
  componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
      //TODO: getProfile must goes here
      //   let profile = this.props.auth.getProfile((profile, error) => {
      //     if (error) {
      //       throw error;
      //     }
      //     return profile;
      //   });
      //   console.log(profile);
    } else {
      throw new Error("Invalid callback URL.");
    }
  }
  render() {
    return <></>;
  }
}
