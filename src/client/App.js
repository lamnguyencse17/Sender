import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import MainPage from "./MainPage";
import Navbar from "./Common/Navbar";
import Messaging from "./Messaging/Messaging";

export default class App extends Component {
  render() {
    return (
      <>
        <Navbar />
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
