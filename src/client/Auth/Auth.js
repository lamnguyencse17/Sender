import auth0 from "auth0-js";
import axios from "axios";

//TODO: Refactor this please! this is a mess!
export default class Auth {
  constructor(history) {
    this.history = history;
    this.userProfile = {
      id: localStorage.getItem("id"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
      gravatar: localStorage.getItem("gravatar"),
    };
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
        this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
          if (profile) {
            axios
              .post(
                `${process.env.AUTH0_AUDIENCE}/api/protected/authenticate`,
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
                  this.setSession(authResult, value.data);
                  this.userProfile = value.data;
                  console.log(value.data)
                  if (!value.data.newUser) {
                    setTimeout(
                      () =>
                        this.history.push({
                          pathname: "/messaging",
                          state: { ...value.data },
                        }),
                      1000
                    );
                  } else {
                    this.history.push({
                      path: "/generation",
                      state: {...value.data}
                    })
                  }
                }
              });
          } else {
            console.log(err);
            this.logout();
          }
        });
      } else if (err) {
        this.logout();
        alert(`Error: ${err.error}. Check the console for further details. `);
        console.log(err);
      }
    });
  };
  setSession = (authResult, profile) => {
    authResult = authResult || this.getAccessToken();
    profile = profile || this.getProfile();
    const current = new Date().getTime();
    const expireAt = JSON.stringify(authResult.expiresIn * 1000 + current);
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expireAt);
    localStorage.setItem("id", profile._id);
    localStorage.setItem("name", profile.name);
    localStorage.setItem("email", profile.email);
    localStorage.setItem("gravatar", profile.gravatar);
  };
  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  logout = () => {
    window.localStorage.clear();
    this.userProfile = null;
    this.auth0.logout({
      clientID: process.env.AUTH0_CLIENT_ID,
      returnTo: "http://localhost:8080",
    });
  };
  startSyncing = () => {
    if (localStorage.getItem("id") !== null) {
      return {
        id: localStorage.getItem("id"),
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
        gravatar: localStorage.getItem("gravatar"),
      };
    } else if (this.userProfile) {
      axios
        .post(
          `${process.env.AUTH0_AUDIENCE}/api/protected/authenticate`,
          {
            email: this.userProfile.email,
            name: this.userProfile.name,
            gravatar: this.userProfile.picture,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${this.getAccessToken()}`,
            },
          }
        )
        .then((value, err) => {
          if (err) {
            console.log(err);
            this.logout();
          } else {
            let { _id, name, email, gravatar } = value.data;
            localStorage.setItem("id", _id);
            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("gravatar", gravatar);
            this.setSession(null, value.data);
            return { ...value.data };
          }
        });
    }
  };
  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    console.log(accessToken);
    if (!accessToken) {
      alert("You don't have right to access this");
      this.logout();
    }
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
