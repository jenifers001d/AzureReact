import React from "react";
import styled from "styled-components";
import { FormGroup, Label, Input } from "reactstrap";

const InfoWrapper = styled.div`
  margin: 10px auto;
`;
const InfoHeader = styled.h2`
  text-align: center;
`;
const InfoContent = styled.div`
  display: flex;
`;
const InfoLeft = styled.div`
  flex-grow: 1;
  margin: 10px 10px 0px;
`;
const InfoRight = styled.div`
  flex-grow: 1;
  margin: 15px 10px 0px;
`;
class InfoForm extends React.Component {
  state = {
    userName: null,
    userEmail: null,
  };
  inputName = e => {
    this.setState(
      {
        userName: e.target.value,
      },
      () => {
        this.props.getUserInfo(this.state);
      }
    );
  };
  inputEmail = e => {
    let re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i;
    let emailContent = "";
    if (e.target.value) {
      let isMatch = e.target.value.match(re);
      if (isMatch !== null) {
        emailContent = e.target.value;
      } else {
        emailContent = "NotRightFormat";
      }
    }
    this.setState(
      {
        userEmail: emailContent,
      },
      () => {
        this.props.getUserInfo(this.state);
      }
    );
  };
  render() {
    return (
      <InfoWrapper>
        <InfoHeader>Information</InfoHeader>
        <InfoContent>
          <InfoLeft>
            <FormGroup>
              <Input
                type="text"
                name="userName"
                id="userName"
                placeholder="Name (Required)"
                onChange={this.inputName}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email (Required)"
                onChange={this.inputEmail}
              />
            </FormGroup>
            <FormGroup>
              <Label for="select">Select Service</Label>
              <Input type="select" name="select" id="select">
                <option>IFN502 Student Consultation</option>
                <option>IFN660 Student Consultation</option>
                <option>IFN647 Student Consultation</option>
                <option>Project meeting</option>
              </Input>
            </FormGroup>
          </InfoLeft>
          <InfoRight>
            <FormGroup>
              <Label for="exampleText">
                Please let me know if you have any special requests.
              </Label>
              <Input type="textarea" name="text" id="exampleText" rows="5" />
            </FormGroup>
          </InfoRight>
        </InfoContent>
      </InfoWrapper>
    );
  }
}

export default InfoForm;
