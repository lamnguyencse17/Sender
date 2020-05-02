import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

class Navbar extends Component {
  render() {
    const { isAuthenticated, login, logout } = this.props.auth;
    return (
      <div className="header">
        <div className="logo">
          <div className="logo-text">
            <Link to="/">SENDER</Link>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              {isAuthenticated() ? (
                <Link to="#" onClick={logout}>
                  Logout
                </Link>
              ) : (
                <Link to="#" onClick={login}>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}
export default Navbar;
