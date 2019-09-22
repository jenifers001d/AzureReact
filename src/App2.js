import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Container, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import NavBar from "./NavBar";
import InfoForm from "./InfoForm";
import Schedule from "./Schedule";
import moment from "moment";

// Helper function to format Graph date/time
function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format("hh:mm a");
}

let eventsDateStartEndArray; // store appointments' time into month array

class App2 extends React.Component {
  state = {
    data: null,
    business: null,
    calendarEvents: [],
    services: null,
  };

  // When component did update, call storeEvents()
  storeEvents = events => {
    let bookingDateTime = []; // sets of booked time
    events.forEach(item => {
      bookingDateTime.push({
        start: item.start.dateTime, // e.g. 2019-09-12T09:30:00+10:00
        end: item.end.dateTime, // e.g. 2019-09-12T10:30:00+10:00
      });
    });

    eventsDateStartEndArray = new Array(12);

    // convert sets of booked time into month array structure
    bookingDateTime.forEach(item => {
      let eventStartTime = new Date(item.start);
      const month = eventStartTime.getMonth();
      const date = eventStartTime.getDate();
      const startTime = eventStartTime.getTime();
      const endTime = new Date(item.end).getTime();
      if (eventsDateStartEndArray[month] === undefined) {
        eventsDateStartEndArray[month] = [];
      }
      eventsDateStartEndArray[month].push({
        date,
        startTime,
        endTime,
      });
    });
    console.log(eventsDateStartEndArray);
    // e.g. eventsDateStartEndArray is
    // [empty × 8, [{date: 12, startTime: 1568244600000, endTime: 1568248200000}], empty × 3]
  };

  componentDidMount() {
    fetch("http://localhost:5500/book")
      //fetch("/book")
      .then(data => data.json())
      .then(result => {
        this.setState(
          {
            data: result,
            business: JSON.parse(result.business),
            calendarEvents: JSON.parse(result.events),
            services: JSON.parse(result.services).value,
          },
          () => {
            console.log("設定資料完畢");
          }
        );
      })
      .catch(e => console.log("錯誤:", e));
  }

  //  componentDidMount ? 因為我現在是DidMount後才拿到資料，所以用DidUpdate來改變 eventsDateStartEndArray
  // 小心決定呼叫 storeEvents 的時間，不然會導致每次更新就儲存一次，產生 CPU 爆掉，不知名問題
  // componentDidUpdate() {
  //   if (eventsDateStartEndArray === undefined) {
  //     this.storeEvents(this.state.calendarEvents);
  //   }
  // }

  sentData = () => {
    fetch("http://localhost:5500")
      .then(data => data.json())
      .then(result => {
        console.log(result);
        // this.setState({
        //   data: result,
        //   business: JSON.parse(result.business),
        //   calendarView: JSON.parse(result.events),
        //   service: JSON.parse(result.services).value,
        // });
      })
      .catch(e => console.log("錯誤:", e));
  };

  render() {
    console.log("render");
    let { business, calendarEvents, services } = this.state;
    console.log(business);
    console.log(calendarEvents);
    console.log(services);

    return (
      <Router>
        <NavBar isAuthenticated={false} />
        <Container>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <>
                  <InfoForm />
                  <Schedule events={this.state.calendarEvents} />
                  <RouterNavLink to="/book" className="nav-link">
                    <Button color="primary" onClick={this.sentData}>
                      Sent Book
                    </Button>
                  </RouterNavLink>
                </>
              );
            }}
          />
        </Container>
      </Router>
    );
  }
}

export default App2;
