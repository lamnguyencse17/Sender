import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Navbar from "./Common/Navbar";
import Messaging from "./Messaging/Messaging";
import Auth from "./Auth/Auth";
import Callback from "./Callback";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
  }
  render() {
    return (
      <>
        <Navbar auth={this.auth} />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <MainPage {...props} auth={this.auth} />}
          />
          <Route
            path="/messaging"
            render={(props) => <Messaging {...props} />}
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
