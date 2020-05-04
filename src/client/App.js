import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Navbar from "./Common/Navbar";
import Messaging from "./Messaging/Messaging";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import PropTypes from "prop-types";

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
    if (this.auth.isAuthenticated()) {
      this.profile = this.auth.startSyncing();
    }
  }
  render() {
    return (
      <>
        <Navbar auth={this.auth} />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <MainPage auth={this.auth} profile={this.profile} {...props} />
            )}
          />
          <Route
            path="/messaging"
            render={(props) => (
              <Messaging auth={this.auth} profile={this.profile} {...props} />
            )}
          />
          <Route
            path="/callback"
            render={(props) => <Callback auth={this.auth} {...props} />}
          />
        </Switch>
      </>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;
