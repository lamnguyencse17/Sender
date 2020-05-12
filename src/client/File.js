import React, { PureComponent } from "react";
import Loading from "./Common/Loading";
import axios from "axios";
import mime from "mime-types";
import { fileDecapsulator, validatePrivateKey } from "./Crypto/crypto";
import PrivateInput from "./Messaging/PrivateInput";

export default class File extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      privateKeyAvailable: false
    };
  }
  closePrivateInput = () => {
    let privateKey = sessionStorage.getItem("privateKey");
    if (privateKey && validatePrivateKey(privateKey)) {
      this.setState({
        privateKeyAvailable: true,
      });
    }
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
      .then(async (result, err) => {
        if (err) {
          throw err;
        } else {
          let file = await fileDecapsulator(result.data, result.headers.iv, result.headers.passphrase)
          console.log(file)
          let blob = new Blob([file], {
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
  };
  render() {
    return <>
    <PrivateInput
          open={!this.state.privateKeyAvailable}
          closeModal={this.closePrivateInput}
        />
    {this.state.fetching && this.state.privateKeyAvailable ? <Loading /> : <></>}
    </>;
  }
}
