import forge from "node-forge";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Generation extends Component {
  constructor(props) {
    super(props);
    axios
      .get("http://localhost:3000/api/protected/key", {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
        },
      })
      .then((result, err) => {
        if (err) {
          console.log(err);
        } else {
          sessionStorage.setItem("serverPublicKey", result.data);
        }
      });
  }
  handleGeneration = () => {
    let rsa = forge.pki.rsa;
    rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keypair) => {
      if (err) {
        console.log(err);
      } else {
        axios.post(
          "http://localhost:3000/api/protected/key",
          {
            publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
            id: localStorage.getItem("id"),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${this.props.auth.getAccessToken()}`,
            },
          }
        );
        sessionStorage.setItem(
          "privateKey",
          forge.pki.privateKeyToPem(keypair.privateKey)
        );
        this.setState({
          publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
          privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
        });
      }
    });
  };
  render() {
    return (
      <div>
        {this.state ? (
          <div>
            {this.state.publicKey} <br></br> {this.state.privateKey} <br></br>{" "}
            <Link to={{
              pathname: "/messaging",
              state: {
                ...this.props.location.state
              }
            }} > Move to Messaging</Link>
          </div>
        ) : (
            <>
              <h1> Please keep the private key somewhere safe</h1>
              <h1> If you have already generated the keypair, this option will update with the new one</h1>
              <button onClick={this.handleGeneration}>Generate KeyPair</button>
            </>
          )}
      </div>
    );
  }
}
