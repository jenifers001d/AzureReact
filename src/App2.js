import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import moment from "moment";
import { Container, Button, Spinner } from "reactstrap";
import styled from "styled-components";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./NavBar";
import InfoForm from "./InfoForm";
import Schedule from "./Schedule";

const SentButton = styled(Button)`
  margin: 0px auto 10px;
  display: flex;
  justify-content: center;
`;
const SpinnerWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: white;
  position: relative;
  top: -71px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledSpinner = styled(Spinner)``;
const NoAccessTokenMsg = styled.div`
  height: 75vh;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

class App2 extends React.Component {
  state = {
    business: null,
    calendarEvents: null,
    services: null,
    regisURL: null,
    selectedDate: null,
    userInfo: {
      userName: null,
      userEmail: null,
    },
    isLoad: false,
  };

  componentDidMount() {
    this.getURLandBookingsData();
  }

  getURLandBookingsData = () => {
    //fetch("http://localhost:5500/url")
    fetch("/url") // get registering url
      .then(data => data.text())
      .then(urlResult => {
        //fetch("http://localhost:5500/book")
        fetch("/book") // get bookings data
          .then(data => data.json())
          .then(bookingsResults => {
            this.setState({
              business: bookingsResults.business,
              calendarEvents: bookingsResults.events, // appointments will be passed into <Schedule/>
              services: bookingsResults.services,
              regisURL: urlResult,
              isLoad: true,
            });
          });
      });
  };
  getSelectedDate = data => {
    this.setState({
      selectedDate: data,
    });
  };
  getUserInfo = data => {
    this.setState({
      userInfo: data,
    });
  };
  sentData = () => {
    // send data through bookings api
    const { selectedDate, userInfo } = this.state;
    if (selectedDate && userInfo.userName && userInfo.userEmail) {
      if (userInfo.userEmail !== "NotRightFormat") {
        alert(
          "Thank you for using BOOKING WEB APP.\nPlease wait for 5 sec ..."
        );
        //fetch("http://localhost:5500/book", {
        fetch("/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "@odata.type": "#microsoft.graph.bookingAppointment",
            customerEmailAddress: userInfo.userEmail,
            customerName: userInfo.userName,
            customerNotes: "Please be on time.",
            customerPhone: "213-555-0199",
            end: {
              "@odata.type": "#microsoft.graph.dateTimeTimeZone",
              dateTime: moment(selectedDate.tempEndTime).format(),
              timeZone: "Australia/Brisbane",
            },
            serviceId: "6fbd2880-9e81-4f0f-9d78-291d0ce9066f",
            serviceName: "Initial consult",
            start: {
              "@odata.type": "#microsoft.graph.dateTimeTimeZone",
              dateTime: moment(selectedDate.tempStartTime).format(),
              timeZone: "Australia/Brisbane",
            },
          }),
        }).then(res => {
          window.location.reload();
          //return res.text();
        });
      } else {
        alert("Format of Email is wrong!");
      }
    } else {
      if (selectedDate === null) {
        alert("Please choose time~");
      } else {
        alert("Please input Name and Email !");
      }
    }
  };

  render() {
    const { business, calendarEvents, services, regisURL, isLoad } = this.state;
    let loadingClasses = "hidden",
      mainClasses = "";
    console.log(business);
    console.log(calendarEvents);
    console.log(services);
    // when data haven't been loaded, hide main views and show loading img
    if (!isLoad) {
      mainClasses = "hidden";
      loadingClasses = "";
    }
    // check if there is data in the database
    let noAccessTokenRecord =
      isLoad &&
      business === null &&
      calendarEvents === null &&
      services === null;

    return (
      <>
        <SpinnerWrapper className={loadingClasses}>
          <StyledSpinner color="primary" />
        </SpinnerWrapper>
        <div className={mainClasses}>
          <NavBar url={regisURL} showRegister={noAccessTokenRecord} />
          <Container>
            {noAccessTokenRecord ? (
              <NoAccessTokenMsg>
                <h1>There is no data in the database</h1>
                <h1>Administrator have to register at first !</h1>
              </NoAccessTokenMsg>
            ) : (
              <Router>
                <Route
                  exact
                  path="/"
                  render={() => {
                    return (
                      <>
                        <InfoForm getUserInfo={this.getUserInfo} />
                        <Schedule
                          events={this.state.calendarEvents}
                          getSelectedDate={this.getSelectedDate}
                        />
                        <SentButton color="primary" onClick={this.sentData}>
                          Sent Book
                        </SentButton>
                      </>
                    );
                  }}
                />
              </Router>
            )}
          </Container>
        </div>
      </>
    );
  }
}

export default App2;
