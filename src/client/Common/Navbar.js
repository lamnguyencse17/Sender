import React, { Component } from "react";
import { Link } from "react-router-dom";

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
              <Link to="/messaging">Messaging</Link>
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
