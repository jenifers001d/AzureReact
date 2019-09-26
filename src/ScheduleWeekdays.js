import React from "react";
import moment from "moment";
import styled from "styled-components";
import SlotCell from "./SlotCell";

const DayWrapper = styled.div`
  width: 100%;
  margin: 0px 2.5px;
`;
const WeekTitleCell = styled.div`
  margin: 5px 10px;
  width: 14.2%;
  height: 45px;
  line-height: 23px;
`;
const DateOfWeek = styled.div`
  font-size: 20px;
`;
const RowCells = styled.div`
  padding: 5px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;
const SlotWrapper = styled.div``;
const TimeCell = styled.div`
  border: 1px dashed rgb(228, 228, 228);
  width: 100%;
  height: 51px;
  text-align: center;
  line-height: 26px;
  margin: 1px 0px;
`;

const time = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

class ScheduleWeekdays extends React.Component {
  state = {
    tempBookTime: {
      tempStartTime: null,
      tempEndTime: null,
    },
    mouseIsDown: false,
  };
  handleMouseDown = (e, dayAfterToday, isFree) => {
    const duration = 30 * 60 * 1000;
    if (dayAfterToday && isFree) {
      this.setState(
        {
          tempBookTime: {
            tempStartTime: e.target.value,
            tempEndTime: moment(e.target.value + duration),
          },
          mouseIsDown: true,
        },
        () => {
          this.props.getDate(this.state.tempBookTime); // send selected time back to App2.js
        }
      );
    } else {
      alert("Please choose another day.");
    }
  };
  handleMouseOver = e => {
    // when mouse is down, this method can start to work
    let { tempBookTime } = this.state;
    const duration = 30 * 60 * 1000;
    this.setState(
      {
        tempBookTime: {
          tempStartTime: tempBookTime.tempStartTime,
          tempEndTime: moment(e.target.value + duration),
        },
      },
      () => {
        this.props.getDate(this.state.tempBookTime); // send selected time back to App2.js
      }
    );
  };
  handleMouseUp = () => {
    this.setState({
      mouseIsDown: false,
    });
  };
  handleChooseBusyDay = busyDay => {
    let { tempBookTime } = this.state;
    const duration = 30 * 60 * 1000;
    if (busyDay) {
      this.setState(
        {
          tempBookTime: {
            tempStartTime: tempBookTime.tempStartTime,
            tempEndTime: moment(tempBookTime.tempStartTime + duration),
          },
          mouseIsDown: false,
        },
        () => {
          this.props.getDate(this.state.tempBookTime); // send selected time back to App2.js
        }
      );
    }
  };

  renderCells = (day, dateEvents) => {
    const slotInterval = 30;
    const startOfHour = moment(day) // start time of a day
      .hour(8)
      .minute(0)
      .second(0)
      .millisecond(0);
    const endOfHour = moment(day) // end time of a day
      .hour(17)
      .minute(0)
      .second(0)
      .millisecond(0);

    let slots = [];
    let hour = startOfHour;
    let i = 0;
    let isBusy;
    while (hour < endOfHour) {
      isBusy = false;
      // if there is appointments which haven't been shown on schedule
      if (i < dateEvents.length) {
        let afterStart = dateEvents[i].start.diff(hour, "minutes") <= 0;
        let beforeEnd = dateEvents[i].end.diff(hour, "minutes") > 0;
        // if time is between busy appointment period, flag it is busy
        if (afterStart && beforeEnd) {
          isBusy = true; // isBusy will be passed into <SlotCell>
        }
        // if time is equal to end of appointment, jump to next appointment
        if (dateEvents[i].end.diff(hour, "minutes") === 0) {
          i++;
        }
      }

      slots.push(
        <SlotCell
          key={hour}
          time={hour}
          isBusy={isBusy}
          // tempBookTime is passed into for processing selecting css (green)
          tempBookTime={this.state.tempBookTime}
          handleMouseDown={this.handleMouseDown}
          handleChooseBusyDay={this.handleChooseBusyDay}
        ></SlotCell>
      );
      hour = moment(hour).add(slotInterval, "m");
    }
    return <SlotWrapper>{slots}</SlotWrapper>;
  };

  render() {
    const { current, events } = this.props;
    const { mouseIsDown } = this.state;
    const weekdaysFormat = "ddd";
    const weekdatesFormat = "D";
    const startDay = moment(current).day(0); // The start day of this week(e.g. Sun 15)
    let weekdays = [];
    let day, classes, curPosition, diff;
    // A week is 7 days, produce each column and slots from Sun, Mon to Sat
    for (let i = 0; i < 7; i++) {
      // add day by day to the start day of this week
      day = moment(startDay).add(i, "d");

      // set days before today to gray color, and today to peach color
      classes = "";
      curPosition = moment(day);
      diff = curPosition.diff(new Date(), "hours");
      if (diff < 0) {
        classes = "before";
      } else if (diff === 0) {
        classes = "today";
      }

      // check if there is appointments at curPosition "that" day.
      let dateEvents = [];
      events.forEach(event => {
        if (curPosition.date() === moment(event.start).date()) {
          dateEvents.push({
            start: moment(event.start),
            end: moment(event.end),
          });
        }
      });
      // if there is, pass appointments of that day into renderCells() as below
      weekdays.push(
        <DayWrapper
          key={i}
          className={classes}
          onMouseOver={mouseIsDown ? this.handleMouseOver : null}
          onMouseUp={this.handleMouseUp}
        >
          <WeekTitleCell>
            <div>{moment(day).format(weekdaysFormat)}</div>
            <DateOfWeek>{moment(day).format(weekdatesFormat)}</DateOfWeek>
          </WeekTitleCell>
          {this.renderCells(day, dateEvents)}
        </DayWrapper>
      );
    }
    return (
      <RowCells>
        <DayWrapper>
          <WeekTitleCell></WeekTitleCell>
          <SlotWrapper>
            {time.map(item => (
              <TimeCell key={item}>{item}</TimeCell>
            ))}
          </SlotWrapper>
        </DayWrapper>
        {weekdays}
      </RowCells>
    );
  }
}

export default ScheduleWeekdays;
