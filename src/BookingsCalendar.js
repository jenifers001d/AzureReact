import React from "react";
import { Button } from "reactstrap";
import moment from "moment";
import config from "./Config";
import { getBookingsCalendarView, publishBookings } from "./GraphService";

import Calendar from "react-calendar";

// Helper function to format Graph date/time
function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format("hh:mm a");
}

let timeData;

export default class BookingCalendar extends React.Component {
  state = {
    bookingsEvents: [],
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

  storeEvents = events => {
    let bookingDateTime = [];
    events.forEach(item => {
      bookingDateTime.push({
        start: item.start.dateTime,
        end: item.end.dateTime,
      });
    });

    timeData = new Array(12);
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
  };

  showEvents = (month, date) => {
    if (timeData[month] === undefined) {
      return <div> No appointment </div>;
    } else {
      let events = timeData[month].filter(item => {
        return item.date === date;
      });
      let show = events.map(item => {
        let s = new Date(item.startTime).toLocaleTimeString();
        let e = new Date(item.endTime).toLocaleTimeString();
        return <div key={item.startTime}> {s + " - " + e} </div>;
      });
      return show;
    }
  };

  getFreeSlots2 = date => {
    let freeSlots = [];
    let start = new Date(date).setHours(8, 0, 0, 0);
    let end = new Date(date).setHours(17, 0, 0, 0);
    let timeLine = new Date(start); // checked timeline starts from start time
    let timeSlotInterval = 1800;

    let events = [];
    if (timeData[date.getMonth()] !== undefined) {
      events = timeData[date.getMonth()].filter(item => {
        return item.date === date.getDate();
      });
    }
    let i = 0; // count number for booked events
    let interval;
    // If timeline hasn't acheive end time, loop continue
    while (timeLine.getTime() < end) {
      // If there are unchecked events, enter into if condition
      if (i !== events.length) {
        interval = (events[i].startTime - timeLine) / 1000;
        // If timeline hasn't acheive start time of a event
        if (interval >= 3600) {
          console.log(new Date(timeLine)); //顯示出來的可選時間
          // increase timeline by the increment to show free slots
          freeSlots.push(new Date(timeLine));
          timeLine.setTime(timeLine.getTime() + timeSlotInterval * 1000);
        } else if (0 < interval && interval < 3600) {
          // Finally, let timeline = start time of a event
          timeLine.setTime(events[i].startTime); //等於預約事件的起始時間
        }
        // If timeline is equal to start time of a event
        else if (interval == 0) {
          // jump over the event and timeline is equal to end time of a event
          timeLine.setTime(timeLine.getTime() + 3600000); //跳過該預約事件時段
          i++; //choose next event 選擇下一個預約事件
        }
      }
      // If all events have been checked, enter into else condition
      // calculate left time which can be booked
      else {
        interval = (end - timeLine) / 1000;
        if (interval >= 3600) {
          console.log(new Date(timeLine)); //顯示出來的可選時間
          freeSlots.push(new Date(timeLine));
          timeLine.setTime(timeLine.getTime() + timeSlotInterval * 1000);
        } else if (0 < interval && interval < 3600) {
          timeLine.setTime(end);
        }
      }
    }
    return freeSlots;
  };

  getFreeSlots = date => {
    let freeSlots = [];
    let start = new Date(date).setHours(8, 0, 0, 0);
    let end = new Date(date).setHours(17, 0, 0, 0);
    let timeLine = new Date(start);

    let events = [];
    if (timeData[date.getMonth()] !== undefined) {
      events = timeData[date.getMonth()].filter(item => {
        return item.date === date.getDate();
      });
    }
    let i = 0;
    let countHour = 0;
    while (timeLine.getTime() < end) {
      if (i !== events.length) {
        if (timeLine.getTime() < events[i].startTime) {
          let interval = (events[i].startTime - timeLine) / 1000;
          countHour = interval / 3600;
          if (countHour >= 1) {
            for (let i = 1; i <= countHour; i++) {
              console.log(new Date(timeLine)); //顯示出來的可選時間
              freeSlots.push(new Date(timeLine));
              timeLine.setTime(timeLine.getTime() + 3600000);
            }
          }
          timeLine.setTime(events[i].startTime); //等於預約事件的起始時間
        } else if (timeLine.getTime() == events[i].startTime) {
          timeLine.setTime(timeLine.getTime() + 3600000); //跳過該預約事件時段
          i++; //選擇下一個預約事件
        }
      } else {
        let interval = (end - timeLine) / 1000;
        countHour = interval / 3600;
        if (countHour >= 1) {
          for (let i = 1; i <= countHour; i++) {
            console.log(new Date(timeLine)); //顯示出來的可選時間
            freeSlots.push(new Date(timeLine));
            timeLine.setTime(timeLine.getTime() + 3600000);
          }
        }
        timeLine.setTime(end);
      }
    }
    return freeSlots;
  };

  showFreeSlots = date => {
    let freeSlots = this.getFreeSlots2(date);
    return freeSlots.map(slot => (
      <button
        className="slot-btn"
        // outline
        // color="primary"
        key={slot.getHours() + slot.getMinutes()}
      >
        {formatDateTime(slot)}
      </button>
    ));
  };

  async componentDidMount() {
    try {
      // Get the user's access token
      let accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes,
      });
      // Get the user's events
      var events = await getBookingsCalendarView(accessToken);
      console.log(events);
      // Update the array of events in state
      this.setState({
        bookingsEvents: events.value,
      });
      this.storeEvents(events.value);
      console.log(events);
    } catch (err) {
      this.props.showError("ERROR", JSON.stringify(err));
    }
  }

  render() {
    let { bookingsEvents, isPick, date } = this.state;
    let tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return (
      <>
        <div className="panel">
          <Calendar
            onChange={this.handleChange}
            // value={this.state.date}
            minDate={tom}
            tileDisabled={this.tileDisabled}
          />
          <div className="slots">
            <h2 className="myh2"> Appointments </h2>
            {isPick ? this.showEvents(date.getMonth(), date.getDate()) : null}
            <h2 className="myh2"> Free time slots </h2>
            {isPick ? this.showFreeSlots(date) : null}
          </div>
        </div>
        <pre>
          {bookingsEvents.map(event => {
            return (
              <p key={event.selfServiceAppointmentId}>{event.start.dateTime}</p>
            );
          })}
        </pre>
      </>
    );
  }
}
