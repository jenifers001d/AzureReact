import React from "react";
import moment from "moment";
import styled from "styled-components";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleWeekdays from "./ScheduleWeekdays";

const ScheduleWrapper = styled.div`
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
`;

let eventsDateStartEndArray; // store appointments' time into month array
let bookingDateTime = [];
class Schedule extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    selectedKeys: [],
    selectedItems: [],
    eventsArr: [],
  };

  // When component did update, call storeEvents()
  storeEvents = events => {
    bookingDateTime = []; // sets of booked time
    events.forEach(item => {
      bookingDateTime.push({
        start: item.start.dateTime, // e.g. 2019-09-12T09:30:00+10:00
        end: item.end.dateTime, // e.g. 2019-09-12T10:30:00+10:00
      });
    });
    if (this.state.eventsArr.length === 0) {
      this.setState({
        eventsArr: bookingDateTime,
      });
    }
  };

  prevWeek = current => {
    let now = moment(new Date());
    let curPosition = moment(current);
    let diff = curPosition.diff(now, "days");
    if (-14 < diff && diff < 21) {
      this.setState({
        currentMonth: moment(current).subtract(1, "w"),
      });
    }
  };
  nextWeek = current => {
    let now = moment(new Date());
    let curPosition = moment(current);
    let diff = curPosition.diff(now, "days");
    if (-14 <= diff && diff < 20) {
      this.setState({
        currentMonth: moment(current).add(1, "w"),
      });
    }
  };
  componentDidUpdate() {
    if (bookingDateTime.length === 0) {
      this.storeEvents(this.props.events);
    }
  }
  render() {
    const { currentMonth, eventsArr } = this.state;
    console.log(eventsArr);
    return (
      <>
        <ScheduleWrapper>
          <ScheduleHeader
            current={currentMonth}
            prevWeek={this.prevWeek}
            nextWeek={this.nextWeek}
          />
          <ScheduleWeekdays current={currentMonth} events={eventsArr} />
        </ScheduleWrapper>
      </>
    );
  }
}

export default Schedule;
