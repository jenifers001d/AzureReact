import React from "react";
import moment from "moment";
import styled from "styled-components";

const Cell = styled.div`
  border: 1px dashed rgb(228, 228, 228);
  width: 100%;
  height: 12px;
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
    const { time } = this.state;
    const now = moment(new Date()).startOf("day");
    // 加了 start of day 後就沒問題了，確保 now 從 00:00 開始才會是大於等於一天
    const dayAfterToday = time.diff(now, "days");
    const noWorkDay = time.days();
    if (dayAfterToday > 0 && noWorkDay !== 0 && noWorkDay !== 6) {
      return true;
    } else {
      return false;
    }
  };

  handleClick = e => {
    this.setState({
      isSelected: true,
    });
  };

  handleMouseEnter = e => {
    e.target.value = this.state.time;
    this.setState({
      isHovered: true,
    });
  };

  handleMouseLeave = e => {
    this.setState({
      isHovered: false,
    });
  };

  render() {
    const { time, isHovered } = this.state;
    const { isBusy, tempBookTime } = this.props;
    //let chooseBusyDay = false; // for drag-multi-select
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
        //chooseBusyDay = true; // for drag-multi-select
        //this.props.handleChooseBusyDay(chooseBusyDay); // for drag-multi-select
      }
    }

    return (
      <Cell
        title={isHovered ? moment(time).format("hh:mm A") : ""}
        className={classes}
        value={time}
        // for drag-multi-select
        /*
        onMouseDown={e =>
          this.props.handleMouseDown(e, this.checkAfterToday(), !isBusy)
        }
        */
        // for single-select
        onClick={e =>
          this.props.handleClick(e, this.checkAfterToday(), !isBusy)
        }
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      ></Cell>
    );
  }
}

export default SlotCell;
