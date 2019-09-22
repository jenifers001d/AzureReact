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

class ScheduleWeekdays extends React.Component {
  state = {
    tempBookTime: {
      tempStartTime: null,
      tempEndTime: null,
    },
    mouseIsDown: false,
  };
  handleMouseDown = (e, isFree) => {
    console.log(isFree);
    if (isFree) {
      this.setState({
        tempBookTime: {
          tempStartTime: e.target.value,
          tempEndTime: e.target.value,
        },
        mouseIsDown: true,
      });
    } else {
      alert("Please choose another day.");
    }
  };

  handleMouseOver = e => {
    let { tempBookTime } = this.state;
    this.setState({
      tempBookTime: {
        tempStartTime: tempBookTime.tempStartTime,
        tempEndTime: e.target.value,
      },
    });
  };
  handleMouseUp = () => {
    this.setState({
      mouseIsDown: false,
    });
  };
  handleChooseBusyDay = busyDay => {
    let { tempBookTime } = this.state;
    if (busyDay) {
      //console.log(tempBookTime);
      this.setState({
        tempBookTime: {
          tempStartTime: tempBookTime.tempStartTime,
          tempEndTime: tempBookTime.tempStartTime,
        },
        mouseIsDown: false,
      });
    }
  };

  renderCells = (day, dateEvents) => {
    const slotInterval = 30;
    const startOfHour = moment(day)
      .hour(8)
      .minute(0)
      .second(0)
      .millisecond(0);
    const endOfHour = moment(day)
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
      if (i < dateEvents.length) {
        if (dateEvents[i].diff(hour, "minutes") === 0) {
          isBusy = true;
          i++;
        }
      }

      slots.push(
        <SlotCell
          key={hour}
          time={hour}
          isBusy={isBusy}
          tempBookTime={this.state.tempBookTime}
          onMouseDown={this.handleMouseDown}
          onMouseOver={this.handleMouseOver}
          handleChooseBusyDay={this.handleChooseBusyDay}
        ></SlotCell>
      );
      hour = moment(hour).add(slotInterval, "m");
    }
    return <SlotWrapper>{slots}</SlotWrapper>;
  };

  render() {
    const { current, events } = this.props;
    console.log("ScheduleWeekdays");
    console.log(events);
    const { mouseIsDown } = this.state;
    const weekdaysFormat = "ddd";
    const weekdatesFormat = "D";
    const startDay = moment(current).day(0); // The start day of this week(e.g. Sun 15)
    let weekdays = [];
    let now = moment(new Date());
    let day, classes, curPosition, diff;
    let j = 0;
    // A week is 7 days, produce each column and slots from Sun to Sat
    for (let i = 0; i < 7; i++) {
      // add days to the start day of this week
      day = moment(startDay).add(i, "d");

      // set days before today to gray color, and today to peach color
      classes = "";
      curPosition = moment(day);
      diff = curPosition.diff(now, "hours");
      if (diff < 0) {
        classes = "before";
      } else if (diff === 0) {
        classes = "today";
      }

      // check if there is appointments at curPosition "this" day.
      let dateEvents = [];
      while (
        j < events.length &&
        curPosition.date() === moment(events[j].start).date()
      ) {
        dateEvents.push(moment(events[j].start));
        j++;
      }

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
    return <RowCells>{weekdays}</RowCells>;
  }
}

export default ScheduleWeekdays;
