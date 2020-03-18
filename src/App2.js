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
      selectedServiceName: null,
      selectedServiceId: null,
      serviceNotes: "",
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
              business: bookingsResults.business, // businessHours will be passed into <Schedule/>
              calendarEvents: bookingsResults.events, // appointments will be passed into <Schedule/>
              services: bookingsResults.services, // services will be passed into <InfoForm/>
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
  getInfo = data => {
    this.setState({
      userInfo: data,
    });
  };

  sendData = () => {
    // send data through bookings api
    const { services, selectedDate, userInfo } = this.state;
    let selServiceName = null,
      selServiceId = null;
    // if user doesn't change service option, assign default values to selServiceName and selServiceId
    if (userInfo.selectedServiceName) {
      selServiceName = userInfo.selectedServiceName;
      selServiceId = userInfo.selectedServiceId;
    } else if (services) {
      selServiceName = services[0].displayName;
      selServiceId = services[0].id;
    }

    let info = userInfo.userName && userInfo.userEmail;
    if (selectedDate && info) {
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
            serviceId: selServiceId,
            serviceName: selServiceName,
            serviceNotes: userInfo.serviceNotes,
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
        alert("Please input Name and Email!");
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
    //console.log(services["value"]);
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
                        <InfoForm services={services} getInfo={this.getInfo} />
                        <Schedule
                          business={this.state.business}
                          events={this.state.calendarEvents}
                          getSelectedDate={this.getSelectedDate}
                        />
                        <SentButton color="primary" onClick={this.sendData}>
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
