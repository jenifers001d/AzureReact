import React from "react";
import moment from "moment";
import styled from "styled-components";

const HeaderOuter = styled.div`
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-color: #89c8ff;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  line-height: 33px;
`;
const WeekNav = styled.div`
  width: 35px;
  height: 35px;
  text-align: center;
  line-height: 33px;
  :hover {
    border-radius: 50%;
    background-color: #0088ff;
    color: white;
  }
`;

function ScheduleHeader(props) {
  const current = props.current;
  const headerMonthFormat = "MMM YYYY";
  const startOfWeek = moment(current).startOf("week");
  const endOfWeek = moment(current).endOf("week");
  const datePeriod =
    moment(startOfWeek).format("D") + "-" + moment(endOfWeek).format("D");
  return (
    <HeaderOuter>
      <WeekNav onClick={() => props.prevWeek(current)}> {"<"} </WeekNav>
      <div>{datePeriod + " " + moment(current).format(headerMonthFormat)}</div>
      <WeekNav onClick={() => props.nextWeek(current)}> {">"} </WeekNav>
    </HeaderOuter>
  );
}

export default ScheduleHeader;
