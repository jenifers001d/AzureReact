import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Container, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "./ErrorMessage";
import Calendar from "react-calendar";
import moment from "moment";

// Helper function to format Graph date/time
function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format("hh:mm a");
}

let timeData; // store booked time into month array

class App3 extends React.Component {
  state = {
    data: null,
    business: null,
    calendarView: [],
    service: null,
    date: new Date(),
    isPick: false,
  };

  handleChange = date => {
    this.setState({
      date,
      isPick: true,
    });
  };

  tileDisabled = ({ activeStartDate, date, view }) => {
    return date.getDay() === 6 || date.getDay() === 0;
  };

  // When component did mount, call storeEvents()
  storeEvents = events => {
    let bookingDateTime = []; // sets of booked time
    events.forEach(item => {
      bookingDateTime.push({
        start: item.start.dateTime, // e.g. 2019-09-12T09:30:00+10:00
        end: item.end.dateTime, // e.g. 2019-09-12T10:30:00+10:00
      });
    });

    timeData = new Array(12);

    // convert sets of booked time into month array structure
    bookingDateTime.forEach(item => {
      let eventStartTime = new Date(item.start);
      const month = eventStartTime.getMonth();
      const date = eventStartTime.getDate();
      const startTime = eventStartTime.getTime();
      const endTime = new Date(item.end).getTime();
      if (timeData[month] === undefined) {
        timeData[month] = [];
      }
      timeData[month].push({
        date,
        startTime,
        endTime,
      });
    });
    // e.g. timeData is
    // [empty × 8, [{date: 12, startTime: 1568244600000, endTime: 1568248200000}], empty × 3]
  };

  // If user picks a date on panel, booked events of picked date show under "Appointments"
  showEvents = (month, date) => {
    if (timeData[month] === undefined) {
      return <div> No appointment </div>;
    } else {
      let events = timeData[month].filter(item => {
        return item.date === date;
      });

      // format date/time
      let show = events.map(item => {
        let s = formatDateTime(new Date(item.startTime));
        let e = formatDateTime(new Date(item.endTime));
        return <div key={item.startTime}> {s + " - " + e} </div>;
      });
      return show;
    }
  };

  chooseTimeHandler = slot => {
    alert(formatDateTime(slot));
  };
  // If user picks a date on panel, show free slots
  showFreeSlots = date => {
    let freeSlots = this.getFreeSlots(date);
    return freeSlots.map(slot => (
      <button
        className="slot-btn"
        // outline
        // color="primary"
        key={slot.getHours() + slot.getMinutes()}
        onClick={() => this.chooseTimeHandler(slot)}
      >
        {formatDateTime(slot)}
      </button>
    ));
    //return 0;
  };

  processMSTime = time => {
    let re = /(\d+[dhms]+)(\d*[hms]*)(\d*[ms]*)(\d*[s]*)/i;
    let found = time.match(re);
    let period = {};
    let eachTimeFormat = [];
    for (let i = 1; i <= 4; i++) {
      period = {};
      if (found[i] !== "") {
        period.num = found[i].slice(0, -1);
        period.duration = found[i].slice(-1);
        eachTimeFormat.push(period);
      }
    }
    let intervalSec = 0;
    let num;
    for (let i = 0; i < eachTimeFormat.length; i++) {
      num = parseInt(eachTimeFormat[i].num);
      switch (eachTimeFormat[i].duration) {
        case "S":
          intervalSec += num;
          break;
        case "M":
          intervalSec += num * 60;
          break;
        case "H":
          intervalSec += num * 60 * 60;
          break;
        case "D":
          intervalSec += num * 60 * 60 * 24;
          break;
        default:
          console.log("no matching duration with" + eachTimeFormat[i].duration);
          break;
      }
    }
    return intervalSec;
  };

  // check free slots by booked events of picked date
  getFreeSlots = date => {
    let freeSlots = [];
    let start = new Date(date).setHours(8, 0, 0, 0);
    let end = new Date(date).setHours(17, 0, 0, 0);
    let timeLine = new Date(start); // checked timeline starts from start time

    let timeSlotInterval = this.state.business.schedulingPolicy
      .timeSlotInterval;
    timeSlotInterval = this.processMSTime(timeSlotInterval);

    let events = [];
    if (timeData[date.getMonth()] !== undefined) {
      events = timeData[date.getMonth()].filter(item => {
        return item.date === date.getDate();
      });
    }
    let i = 0; // count number for booked events
    let interval;
    let pickableSlotTime;
    // If timeline hasn't acheive end time, loop continue
    while (timeLine.getTime() < end) {
      // If there are unchecked events, enter into if condition
      if (i !== events.length) {
        interval = (events[i].startTime - timeLine) / 1000;
        // If timeline hasn't acheive start time of a event
        while (interval > 0) {
          if (interval < 3600) {
            // interval is not enough for service period
            timeLine.setTime(events[i].startTime);
            interval = (events[i].startTime - timeLine) / 1000;
            break;
          }
          freeSlots.push(new Date(timeLine));
          pickableSlotTime = new Date(
            timeLine.getTime() + timeSlotInterval * 1000
          );
          // compare "service period" and "interval of pickable slot"
          // choose nearer one
          if (pickableSlotTime < events[i].startTime) {
            timeLine.setTime(pickableSlotTime);
          } else {
            timeLine.setTime(events[i].startTime);
          }
          interval = (events[i].startTime - timeLine) / 1000;
        }

        if (interval == 0) {
          // If timeline is equal to start time of a event
          // jump over the event and timeline is equal to end time of a event
          timeLine.setTime(timeLine.getTime() + 3600000); //跳過該預約事件時段
          i++; //choose next event 選擇下一個預約事件
        }
      } else {
        // If all events have been checked, enter into else condition
        // calculate left time which can be booked
        interval = (end - timeLine) / 1000;
        if (interval >= 3600) {
          freeSlots.push(new Date(timeLine));
          timeLine.setTime(timeLine.getTime() + timeSlotInterval * 1000);
        } else if (0 < interval && interval < 3600) {
          timeLine.setTime(end);
        }
      }
    }
    return freeSlots;
  };

  // Click "Customer Go To Book" and then fetch data
  getData = () => {
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
  };
  makeBook = () => {
    fetch("http://localhost:5500/book/makeBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "@odata.type": "#microsoft.graph.bookingAppointment",
        customerEmailAddress: "jenifers001d@gmail.com",
        customerName: "Jordan Miller",
        customerNotes: "Please be on time.",
        customerPhone: "213-555-0199",
        end: {
          "@odata.type": "#microsoft.graph.dateTimeTimeZone",
          dateTime: "2019-09-10T09:30:00+10:00",
          timeZone: "Australia/Brisbane",
        },
        serviceId: "6fbd2880-9e81-4f0f-9d78-291d0ce9066f",
        serviceName: "Initial consult",
        start: {
          "@odata.type": "#microsoft.graph.dateTimeTimeZone",
          dateTime: "2019-09-10T08:30:00+10:00",
          timeZone: "Australia/Brisbane",
        },
      }),
    })
      .then(res => {
        console.log(res);
        return res.text();
      })
      .then(result => {
        console.log(result);
      });
  };

  //  componentDidMount ? 因為我現在是DidMount後才拿到資料，所以用DidUpdate來改變 timeData
  // 小心決定呼叫 storeEvents 的時間，不然會導致每次更新就儲存一次，產生 CPU 爆掉，不知名問題
  componentDidUpdate() {
    if (timeData === undefined) {
      this.storeEvents(this.state.calendarView);
    }
  }

  render() {
    let { calendarView, isPick, date, data } = this.state;
    let tom = new Date();
    let mydata = [],
      mydata2 = [];
    if (data !== null) {
      mydata.push(data.services);
      mydata2.push(data.events);
      //console.log(JSON.parse(mydata[0]).value);
    }

    tom.setDate(tom.getDate() + 1); // set started date which I can pick on calendar panel

    return (
      <Router>
        <Container>
          <RouterNavLink to="/book" className="nav-link">
            <Button color="primary" onClick={this.getData}>
              Customer Go To Book
            </Button>
          </RouterNavLink>

          <Route
            exact
            path="/book"
            render={() => {
              return (
                <>
                  {mydata.map((item, index) => {
                    return (
                      <ErrorMessage
                        key={index}
                        msg="Different services:"
                        des={item}
                      />
                    );
                  })}
                  {mydata2.map((item, index) => {
                    return (
                      <ErrorMessage
                        key={index}
                        msg="Calendar events:"
                        des={item}
                      />
                    );
                  })}
                  <div>
                    <div className="panel">
                      <Calendar
                        onChange={this.handleChange}
                        // value={this.state.date}
                        minDate={tom}
                        tileDisabled={this.tileDisabled}
                      />
                      <div className="slots">
                        <h2 className="myh2"> Appointments </h2>
                        {isPick
                          ? this.showEvents(date.getMonth(), date.getDate())
                          : null}
                        <h2 className="myh2"> Free time slots </h2>
                        {isPick ? this.showFreeSlots(date) : null}
                      </div>
                    </div>
                    <pre>
                      {calendarView.map(event => {
                        return (
                          <p key={event.start.dateTime}>
                            {event.start.dateTime}
                          </p>
                        );
                      })}
                    </pre>
                  </div>
                  <button onClick={this.makeBook}>Send book</button>
                </>
              );
            }}
          />
        </Container>
      </Router>
    );
  }
}

export default App3;
