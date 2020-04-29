import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Messaging from "./Messaging/Messaging";

export default class App extends Component {
  render() {
    return (
      <>
        <div className="header">
          <div className="logo">
            <div className="logo-text">SENDER</div>
          </div>
        </div>
        <Switch>
          <Route exact path="/" render={(props) => <MainPage {...props} />} />
          <Route
            path="/messaging"
            render={(props) => <Messaging {...props} />}
          />
        </Switch>
      </>
    );
  }
}
