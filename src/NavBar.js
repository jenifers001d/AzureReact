import React from "react";
import {
  Container,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

export default class NavBar extends React.Component {
  render() {
    const url = this.props.url;
    return (
      <div>
        {/* expand="md"：橫列版的navbar，navbar的class要再加navbar-expand-xl|lg|md|sm。
        跟之前提過的RWD一樣，會在這些螢幕寬度以上時做出橫列，小於的話就疊起來 */}
        <Navbar color="dark" dark expand="md" fixed="top">
          <Container>
            <NavbarBrand href="/">BOOKING WEB APP</NavbarBrand>
            <Nav navbar>
              <NavItem>
                {this.props.showRegister ? (
                  <NavLink href={url} target="_blank">
                    Register
                  </NavLink>
                ) : null}
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}
