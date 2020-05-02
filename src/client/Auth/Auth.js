import auth0 from "auth0-js";
import axios from "axios";

export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = null;
    this.auth0 = new auth0.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      redirectUri: process.env.AUTH0_CALLBACK,
      responseType: "token id_token",
      scope: "openid profile email",
      audience: `${process.env.AUTH0_AUDIENCE}`,
    });
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuthentication = async () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
          console.log(`Bearer ${authResult.accessToken}`);
          if (profile) {
            this.userProfile = profile;
            // axios.defaults.headers.common[
            //   "Authorization"
            // ] = `Bearer ${authResult.accessToken}`;
            axios
              .post(
                `${process.env.AUTH0_AUDIENCE}/api/protected/authenticate`,
                // headers: {
                //   "Content-Type": "application/json",
                //   "Access-Control-Allow-Origin": "*",
                //   Authorization: `Bearer ${authResult.accessToken}`,
                // },
                {
                  email: profile.email,
                  name: profile.name,
                  gravatar: profile.picture,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${authResult.accessToken}`,
                  },
                }
              )
              .then((value, err) => {
                if (err) {
                  console.log(err);
                  this.logout();
                } else {
                  console.log(value);
                  this.history.push({
                    pathname: "/messaging",
                    state: { ...value.data },
                  });
                }
              });
            //TODO: Check with Server whether user is registered
          }
        });
      } else if (err) {
        this.history.push("/");
        this.logout();
        alert(`Error: ${err.error}. Check the console for further details. `);
        console.log(err);
      }
    });
  };
  setSession = (authResult) => {
    const current = new Date().getTime();
    const expireAt = JSON.stringify(authResult.expiresIn * 1000 + current);

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expireAt);
  };
  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.userProfile = null;
    this.auth0.logout({
      clientID: process.env.AUTH0_CLIENT_ID,
      returnTo: "http://localhost:8080",
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.log("NO TOEKN");
    }
    console.log(accessToken);
    return accessToken;
  };

  getProfile = (cb = () => {}) => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      console.log(err);
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };
}
