import forge from "node-forge";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Generation extends Component {
  constructor(props) {
    super(props);
  }
  handleGeneration = () => {
    let rsa = forge.pki.rsa;
    rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keypair) => {
      if (err) {
        console.log(err);
      }
      sessionStorage.setItem(
        "publicKey",
        forge.pki.publicKeyToPem(keypair.publicKey)
      );
      sessionStorage.setItem(
        "privateKey",
        forge.pki.privateKeyToPem(keypair.privateKey)
      );
      this.setState({
        publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
        privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
      });
    });
  };
  render() {
    return (
      <div>
        {this.state ? (
          <div>
            {this.state.publicKey} <br></br> {this.state.privateKey} <br></br>{" "}
            <Link to="/messaging">Move to Messaging</Link>
          </div>
        ) : (
          <>
            <button onClick={this.handleGeneration}>Generate KeyPair</button>
          </>
        )}
      </div>
    );
  }
}
