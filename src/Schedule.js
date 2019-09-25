import React from "react";
import moment from "moment";
import styled from "styled-components";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleWeekdays from "./ScheduleWeekdays";

const ScheduleWrapper = styled.div`
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const NoonLine = styled.hr`
  width: 97%;
  border-top: 1px dashed red;
  position: relative;
  top: -282.5px;
`;

let bookingDateTime = [];
class Schedule extends React.Component {
  state = {
    currentMonth: new Date(),
    eventsArr: [],
  };

  // When component did update, call storeEvents()
  storeEvents = events => {
    bookingDateTime = []; // many sets of appointment time
    events.forEach(item => {
      bookingDateTime.push({
        start: item.start.dateTime, // e.g. 2019-09-12T09:30:00+10:00
        end: item.end.dateTime, // e.g. 2019-09-12T10:30:00+10:00
        //duration: this.processMSTime(item.duration), // PT1H
      });
    });
    if (this.state.eventsArr.length === 0) {
      this.setState({
        eventsArr: bookingDateTime,
      });
    }
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

  prevWeek = current => {
    let curPosition = moment(current);
    let diff = curPosition.diff(new Date(), "days");
    // only can go back to last week and can go to next two weeks
    if (-7 < diff && diff < 14) {
      this.setState({
        currentMonth: moment(current).subtract(1, "w"),
      });
    }
  };
  nextWeek = current => {
    let curPosition = moment(current);
    let diff = curPosition.diff(new Date(), "days");
    // only can go back to last week and can go to next two weeks
    if (-7 <= diff && diff < 13) {
      this.setState({
        currentMonth: moment(current).add(1, "w"),
      });
    }
  };
  componentDidUpdate() {
    // if there are response data (i.e. !==null) and events haven't been processed
    if (this.props.events !== null && bookingDateTime.length === 0) {
      this.storeEvents(this.props.events);
    }
  }
  render() {
    const { currentMonth, eventsArr } = this.state;
    return (
      <>
        <ScheduleWrapper>
          <ScheduleHeader
            current={currentMonth}
            prevWeek={this.prevWeek}
            nextWeek={this.nextWeek}
          />
          <ScheduleWeekdays
            current={currentMonth}
            events={eventsArr}
            getDate={this.props.getSelectedDate}
          />
          <NoonLine />
        </ScheduleWrapper>
      </>
    );
  }
}

export default Schedule;
