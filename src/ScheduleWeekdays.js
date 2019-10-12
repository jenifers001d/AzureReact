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
  height: 25px;
  text-align: center;
  line-height: 24px;
  margin: 1px 0px;
`;

const time = [
  "8:00",
  "8:30",
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const slotPeriod = 15;

class ScheduleWeekdays extends React.Component {
  state = {
    tempBookTime: {
      tempStartTime: null,
      tempEndTime: null,
    },
    //mouseIsDown: false, // for drag-multi-select
  };

  // for single-select
  handleClick = (e, dayAfterToday, isFree) => {
    const duration = slotPeriod * 60 * 1000;
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
  // for drag-multi-select
  /*
  handleMouseDown = (e, dayAfterToday, isFree) => {
    const duration = slotPeriod * 60 * 1000;
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
  */

  // for drag-multi-select
  /*
  handleMouseOver = e => {
    // when mouse is down, this method can start to work
    let { tempBookTime } = this.state;
    const duration = slotPeriod * 60 * 1000;
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
  */

  // for drag-multi-select
  /*
  handleMouseUp = () => {
    this.setState({
      mouseIsDown: false,
    });
  };
  */

  // for drag-multi-select
  /*
  handleChooseBusyDay = busyDay => {
    let { tempBookTime } = this.state;
    const duration = slotPeriod * 60 * 1000;
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
  */

  renderCells = (day, dateEvents, timeSlots) => {
    const slotInterval = slotPeriod;
    let startHourOfService = 8,
      startMinuteOfService = 0;
    let endHourOfService = 17,
      endMinuteOfService = 0;
    // Retrieve business hour which is controlled by admin
    if (timeSlots) {
      let re = /\d+/g;
      let foundStart = timeSlots[0].start.match(re);
      let foundEnd = timeSlots[0].end.match(re);
      startHourOfService = foundStart[0];
      startMinuteOfService = foundStart[1];
      endHourOfService = foundEnd[0];
      endMinuteOfService = foundEnd[1];
    }
    const startHourOfDay = moment(day) // start time of a day
      .hour(8)
      .minute(0)
      .second(0)
      .millisecond(0);
    const endHourOfDay = moment(day) // end time of a day
      .hour(17)
      .minute(0)
      .second(0)
      .millisecond(0);
    const startOfHour = moment(day) // start time of business service
      .hour(startHourOfService)
      .minute(startMinuteOfService)
      .second(0)
      .millisecond(0);
    const endOfHour = moment(day) // end time of business service
      .hour(endHourOfService)
      .minute(endMinuteOfService)
      .second(0)
      .millisecond(0);
    //console.log(endOfHour.days(String));

    let slots = [];
    let hour = startHourOfDay;
    let i = 0;
    let isBusy;
    while (hour < endHourOfDay) {
      isBusy = false;
      // if the start of business hour is after 8:00 (e.g. 9:00) and
      // the end of business hour is before 17:00 (e.g. 16:00)
      // no-business-hour (e.g. 8-9, 16-17) will be flagged to be busy
      if (
        hour.diff(startOfHour, "minutes") < 0 ||
        hour.diff(endOfHour, "minutes") >= 0
      ) {
        isBusy = true;
      }
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
          continue;
        }
      }

      slots.push(
        <SlotCell
          key={hour}
          time={hour}
          isBusy={isBusy}
          // tempBookTime is passed into for processing selecting css (green)
          tempBookTime={this.state.tempBookTime}
          handleClick={this.handleClick} // for single-select
          //handleMouseDown={this.handleMouseDown} // for drag-multi-select
          //handleChooseBusyDay={this.handleChooseBusyDay} // for drag-multi-select
        ></SlotCell>
      );
      hour = moment(hour).add(slotInterval, "m");
    }
    return <SlotWrapper>{slots}</SlotWrapper>;
  };

  render() {
    const { current, events, business } = this.props;
    //const { mouseIsDown } = this.state; // for drag-multi-select
    const weekdaysFormat = "ddd";
    const weekdatesFormat = "D";
    const startDay = moment(current).day(0); // The start day of this week(e.g. Sun 15)
    let weekdays = [];
    let day, classes, curPosition, diff;
    // A week is 7 days, produce each column and slots from Sun, Mon to Sat
    for (let i = 0; i < 7; i++) {
      // add day by day to the start day of this week
      day = moment(startDay).add(i, "d");
      let businessDay, businessHour;
      // If there is no open work slot which are set by admin, the day will not be shown
      if (business) {
        businessDay = moment(startDay).days(business["businessHours"][i].day);
        businessHour = business.businessHours[i].timeSlots;
        if (businessDay.days() === day.days() && businessHour.length === 0) {
          continue;
        }
      }

      // set days before today to gray color, and today to peach color
      classes = "";
      curPosition = moment(day);
      diff = curPosition.diff(new Date(), "hours");
      if (diff < 0) {
        classes = "before";
      } else if (diff === 0) {
        classes = "today";
      }
      if (curPosition.days() === 0 || curPosition.days() === 6) {
        classes += " no-work-day";
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
          //onMouseOver={mouseIsDown ? this.handleMouseOver : null} // for drag-multi-select
          //onMouseUp={this.handleMouseUp} // for drag-multi-select
        >
          <WeekTitleCell>
            <div>{moment(day).format(weekdaysFormat)}</div>
            <DateOfWeek>{moment(day).format(weekdatesFormat)}</DateOfWeek>
          </WeekTitleCell>
          {this.renderCells(day, dateEvents, businessHour)}
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
