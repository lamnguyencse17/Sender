import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Receiver extends PureComponent {
  render() {
    return (
      <>
        <div className="chat-message-recipient">
          <div className="owner">{this.props.owner}</div>
          {this.props.message}
        </div>
        <br></br>
      </>
    );
  }
}

Receiver.propTypes = {
  owner: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Receiver;
