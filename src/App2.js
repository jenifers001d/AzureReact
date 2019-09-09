import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Container, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import BookingsPage from "./BookingsPage";
import moment from "moment";

// Helper function to format Graph date/time
function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format("hh:mm a");
}

let timeData; // store booked time into month array

class App2 extends React.Component {
  state = {
    data: null,
    business: null,
    calendarView: [],
    service: null,
  };

  // Click "Customer Go To Book" and then fetch data
  // getData = () => {
  //   fetch("http://localhost:5500/book")
  //     .then(data => data.json())
  //     .then(result => {
  //       this.setState({
  //         data: result,
  //         business: JSON.parse(result.business),
  //         calendarView: JSON.parse(result.events),
  //         service: JSON.parse(result.services).value,
  //       });
  //     })
  //     .catch(e => console.log("錯誤:", e));
  // };
  componentWillMount() {
    fetch("http://localhost:5500/book")
      .then(data => data.json())
      .then(result => {
        this.setState({
          data: result,
          business: JSON.parse(result.business),
          calendarView: JSON.parse(result.events),
          service: JSON.parse(result.services).value,
        });
      })
      .catch(e => console.log("錯誤:", e));
  }

  render() {
    //let { calendarView, isPick, date, data } = this.state;
    let { business, calendarView, service } = this.state;
    // let tom = new Date();
    // let mydata = [],
    //   mydata2 = [];
    // if (data !== null) {
    //   mydata.push(data.services);
    //   mydata2.push(data.events);
    //   //console.log(JSON.parse(mydata[0]).value);
    // }

    //tom.setDate(tom.getDate() + 1); // set started date which I can pick on calendar panel

    return (
      <Router>
        <Container>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <RouterNavLink to="/book" className="nav-link">
                  <Button color="primary">Customer Go To Book</Button>
                </RouterNavLink>
              );
            }}
          />
          <Route
            exact
            path="/book"
            render={() => {
              return (
                <BookingsPage
                  business={business}
                  calendarView={calendarView}
                  service={service}
                />
              );
            }}
          />
        </Container>
      </Router>
    );
  }
}

export default App2;
