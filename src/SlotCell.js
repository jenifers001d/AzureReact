import React from "react";
import moment from "moment";
import styled from "styled-components";

const Cell = styled.div`
  border: 1px dashed rgb(228, 228, 228);
  width: 100%;
  height: 25px;
  text-align: center;
  line-height: 26px;
  margin: 1px 0px;
  transition: all 0.05s ease-in-out;
`;
class SlotCell extends React.Component {
  state = {
    time: this.props.time,
    isPicked: null,
    isHovered: false,
  };
  checkAfterToday = () => {
    //const dayAfterToday = this.state.time.diff(new Date(), "days");
    // 這邊很奇怪，半夜要再試一次
    const now = moment(new Date());
    const dayAfterToday = this.state.time > now;
    if (dayAfterToday) {
      //console.log(now);
      return true;
    } else {
      return false;
    }
  };

  handleMouseEnter = e => {
    e.target.value = this.state.time;
    this.setState({ isHovered: true });
  };

  handleMouseLeave = e => {
    this.setState({ isHovered: false });
  };

  render() {
    const { time, isHovered } = this.state;
    const { isBusy, tempBookTime } = this.props;
    let chooseBusyDay = false;
    let classes = "";
    if (this.checkAfterToday() && isBusy) {
      classes = "busy";
    } else if (this.checkAfterToday() && isBusy === false) {
      classes = "mouse-on";
    }
    // if time is between selecting appointment period, change classes to show green
    if (
      this.checkAfterToday() &&
      tempBookTime.tempStartTime <= time &&
      time < tempBookTime.tempEndTime
    ) {
      if (!isBusy) {
        classes += " selecting";
      } else {
        chooseBusyDay = true;
        this.props.handleChooseBusyDay(chooseBusyDay);
      }
    }
    return (
      <Cell
        className={classes}
        value={time}
        onMouseDown={e =>
          this.props.handleMouseDown(e, this.checkAfterToday(), !isBusy)
        }
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {isHovered ? moment(time).format("hh:mm A") : ""}
      </Cell>
    );
  }
}

export default SlotCell;
