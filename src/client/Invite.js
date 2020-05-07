import React, { PureComponent } from "react";
import Loading from "./Common/Loading";
import axios from "axios";

export default class Invite extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }
  componentDidMount() {
    axios
      .post(
        `${process.env.AUTH0_AUDIENCE}/api/protected/invite/${this.props.match.params.roomId}`,
        {
          id: this.props.auth.userProfile.id,
          name: this.props.auth.userProfile.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
          },
        }
      )
      .then((result, err) => {
        if (err) {
          throw err;
        } else {
          if (result.data.err) {
            console.log(result.data.err);
          } else {
            console.log(result.data);
            this.props.history.push("/messaging");
          }
        }
      });
  }
  render() {
    return <>{this.state.fetching ? <Loading /> : <></>}</>;
  }
}
