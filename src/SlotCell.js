import React from "react";
import moment from "moment";
import styled from "styled-components";

const Cell = styled.div`
  border: 1px dashed rgb(228, 228, 228);
  width: 100%;
  height: 35px;
  text-align: center;
  line-height: 35px;
  margin: 1px 0px;
`;
class SlotCell extends React.Component {
  state = {
    time: this.props.time,
    isPicked: null,
  };
  blockFun = () => {
    const dayAfterToday = this.state.time > new Date();
    //const { events } = this.props;
    if (dayAfterToday) {
      return true;
    }
  };
  handleClick = () => {
    if (this.blockFun()) {
      alert(this.state.time);
    }
  };

  handleMouseDown = e => {
    //e.target.classList.remove("mouse-on");
    //e.target.classList.add("selecting");
  };

  handleMouseEnter = e => {
    e.target.value = this.state.time;
    //e.target.classList.remove("mouse-on");
    //e.target.classList.add("selecting");
  };

  handleMouseLeave = e => {
    //e.target.classList.remove("selecting");
    //e.target.classList.add("mouse-on");
  };

  render() {
    const { time } = this.state;
    const { isBusy, tempBookTime } = this.props;
    let chooseBusyDay = false;
    let classes = "";
    if (this.blockFun() && isBusy) {
      classes = "busy";
    } else if (this.blockFun() && isBusy === false) {
      classes = "mouse-on";
    }

    if (
      time <= tempBookTime.tempEndTime &&
      tempBookTime.tempStartTime <= time
    ) {
      if (!isBusy) {
        classes += " selecting";
      } else {
        alert("You cannot choose busy day!");
        chooseBusyDay = true;
        this.props.handleChooseBusyDay(chooseBusyDay);
      }
    }
    return (
      <Cell
        className={classes}
        onClick={this.handleClick}
        value={time}
        onMouseDown={e => this.props.onMouseDown(e, !isBusy)}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {moment(time).format("hh:mm A")}
      </Cell>
    );
  }
}

export default SlotCell;
