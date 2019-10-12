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
    selectedServiceName: null,
    selectedServiceId: null,
    serviceNotes: "",
  };
  inputName = e => {
    this.setState(
      {
        userName: e.target.value,
      },
      () => {
        this.props.getInfo(this.state);
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
        this.props.getInfo(this.state);
      }
    );
  };
  selectService = e => {
    let index = e.target.selectedIndex;
    let pickedChild = e.target.options[index];
    this.setState(
      {
        selectedServiceName: e.target.value,
        selectedServiceId: pickedChild.id,
      },
      () => {
        this.props.getInfo(this.state);
      }
    );
  };
  inputserviceNotes = e => {
    this.setState(
      {
        serviceNotes: e.target.value,
      },
      () => {
        this.props.getInfo(this.state);
      }
    );
  };

  render() {
    const { services } = this.props;
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
              <Input
                type="select"
                name="select"
                id="select"
                onChange={this.selectService}
              >
                {services
                  ? services.map(item => (
                      <option key={item.id} id={item.id}>
                        {item.displayName}
                      </option>
                    ))
                  : ""}
              </Input>
            </FormGroup>
          </InfoLeft>
          <InfoRight>
            <FormGroup>
              <Label for="exampleText">
                Please let me know if you have any special requests.
              </Label>
              <Input
                type="textarea"
                name="text"
                id="exampleText"
                rows="5"
                onChange={this.inputserviceNotes}
              />
            </FormGroup>
          </InfoRight>
        </InfoContent>
      </InfoWrapper>
    );
  }
}

export default InfoForm;
