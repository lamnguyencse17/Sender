import React from "react";
import { Spring } from "react-spring/renderprops.cjs";

export default function MainPage() {
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
                <button>START NOW</button>
              </div>
            </div>
          )}
        </Spring>
      </div>
    </>
  );
}
