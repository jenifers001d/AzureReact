import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./NavBar";
import ErrorMessage from "./ErrorMessage";
import Welcome from "./Welcome";
import Calendar from "./Calendar";
import BookingsCalendar from "./BookingsCalendar";

import config from "./Config";
import { UserAgentApplication } from "msal";
import { getCalenderEvents } from "./GraphService";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.appId,
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
      },
    });

    var user = this.userAgentApplication.getAccount();

    this.state = {
      isAuthenticated: user !== null,
      user: {},
      error: null,
    };

    if (user) {
      console.log(user);
      // Enhance user object with data from Graph
      this.getUserProfile();
    }
  }

  // This method calls the loginPopup function to do the login,
  // then calls the getUserProfile function.
  async login() {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: "select_account",
      });
      await this.getUserProfile();
    } catch (err) {
      var errParts = err.split("|");
      this.setState({
        isAuthenticated: false,
        user: {},
        error: { msg: errParts[1], des: errParts[0] },
      });
    }
  }

  logout = () => {
    this.userAgentApplication.logout();
  };

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      let accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes,
      });

      if (accessToken) {
        // TEMPORARY: Display the token in the error flash
        this.setState({
          isAuthenticated: true,
          error: { msg: "Access token:", des: accessToken.accessToken },
        });
      }
    } catch (err) {
      console.log(err);
      var errParts = err.split("|");
      this.setState({
        isAuthenticated: false,
        user: {},
        error: { message: errParts[1], debug: errParts[0] },
      });
    }
  }

  setErrorMsg = (msg, des) => {
    this.setState({
      error: { msg: msg, des: des },
    });
  };

  render() {
    let error = null;
    if (this.state.error) {
      error = (
        <ErrorMessage msg={this.state.error.msg} des={this.state.error.des} />
      );
    }

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={this.state.isAuthenticated}
            authButtonMethod={
              this.state.isAuthenticated ? this.logout : this.login.bind(this)
            }
            user={this.state.user}
          />
          <Container>
            {error}
            <Route
              exact
              path="/"
              render={() => {
                return (
                  <Welcome
                    isAuthenticated={this.state.isAuthenticated}
                    authButtonMethod={this.login.bind(this)}
                    user={this.state.user}
                  />
                );
              }}
            />
            <Route
              path="/calendar"
              render={() => {
                return <Calendar showError={this.setErrorMsg} />;
              }}
            />
            <Route
              path="/bookingsCalendar"
              render={() => {
                return <BookingsCalendar showError={this.setErrorMsg} />;
              }}
            />
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
