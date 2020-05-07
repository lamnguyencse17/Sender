import React, { PureComponent } from "react";
import Loading from "./Common/Loading";
import axios from "axios";
import mime from "mime-types";

export default class File extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
    };
  }
  componentDidMount() {
    let userId;
    this.props.auth.getProfile((profile) => {
      userId = profile.id;
    });
    axios
      .get(
        `${process.env.AUTH0_AUDIENCE}/api/protected/file/${this.props.match.params.filename}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
            id: userId,
          },
          responseType: "arraybuffer",
        }
      )
      .then((result, err) => {
        if (err) {
          throw err;
        } else {
          let blob = new Blob([result.data], {
            type: result.headers["content-type"],
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${this.props.match.params.filename}.${mime.extension(
              result.headers["content-type"]
            )}`
          );
          document.body.appendChild(link);
          link.click();
        }
      });
  }
  render() {
    return <>{this.state.fetching ? <Loading /> : <></>}</>;
  }
}
