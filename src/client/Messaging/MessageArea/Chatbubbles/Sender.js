import React, { PureComponent } from "react";
import PropTypes from "prop-types";
class Sender extends PureComponent {
  render() {
    return (
      <>
        <div className="chat-message-sender">
          <div className="owner">{this.props.owner}</div>
          {this.props.message}
        </div>
        <br></br>
      </>
    );
  }
}
Sender.propTypes = {
  owner: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Sender;
