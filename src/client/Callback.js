import React, { Component } from "react";
import Loading from "./Common/Loading";
import PropTypes from "prop-types";
import Auth from "./Auth/Auth";

class Callback extends Component {
  componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback URL.");
    }
  }
  render() {
    return <Loading />;
  }
}

Callback.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired,
  location: PropTypes.object.isRequired,
};
export default Callback;
