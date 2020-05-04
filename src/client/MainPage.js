import React from "react";
import { Spring } from "react-spring/renderprops.cjs";
import PropTypes from "prop-types";
import Auth from "./Auth/Auth";

function MainPage(props) {
  const { login } = props.auth;
  return (
    <>
      <div className="body">
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
          config={{ delay: 1000, duration: 3000 }}
        >
          {(props) => (
            <div style={props}>
              <div className="impressive-message">
                DELIVERING YOUR MESSAGE
                <br />
                SAFE & SOUND
                <br />
                <button onClick={login}>START NOW</button>
              </div>
            </div>
          )}
        </Spring>
      </div>
    </>
  );
}

MainPage.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired,
};

export default MainPage;
