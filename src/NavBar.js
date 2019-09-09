import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "@fortawesome/fontawesome-free/css/all.css";

function UserAvatar(props) {}
function AuthNavItem(props) {
  // If authenticated, return a dropdown with the user's info and a
  // sign out button
  if (props.isAuthenticated) {
    return 1;
  }
  // Not authenticated, return a sign in link
  else {
    return (
      <NavItem>
        <NavLink onClick={props.authButtonMethod}>Sign In</NavLink>
      </NavItem>
    );
  }
}
export default class NavBar extends React.Component {
  //  給下拉式選單用
  //   state = {
  //     isOpen: false,
  //   };
  //   toggle = () => {
  //     this.setState({
  //       isOpen: !this.state.isOpen,
  //     });
  //   };
  render() {
    let { isAuthenticated, authButtonMethod, user } = this.props;
    let calendarLink = null;
    if (isAuthenticated) {
      calendarLink = (
        <>
          <NavItem>
            <RouterNavLink to="/calendar" className="nav-link">
              Calendar
            </RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/bookingsCalendar" className="nav-link">
              Bookings Calendar
            </RouterNavLink>
          </NavItem>
        </>
      );
    }
    return (
      <div>
        {/* expand="md"：橫列版的navbar，navbar的class要再加navbar-expand-xl|lg|md|sm。
        跟之前提過的RWD一樣，會在這些螢幕寬度以上時做出橫列，小於的話就疊起來 */}
        <Navbar color="dark" dark expand="md" fixed="top">
          <Container>
            <NavbarBrand href="/">React Graph Tutorial</NavbarBrand>
            {/* <NavbarToggler onClick={this.toggle} /> 下拉式選單那種*/}
            {/* Collapse 的 navbar：拓展開來會是navbar-collapse */}
            {/* collapse navbar-collapse 合併使用時，螢幕寬度過小的話字 */}
            {/* 不會擠在一起(垂直放也一樣)。也就是手機版三條線的圖示，按了會跳出導覽列。 */}
            <Collapse navbar>
              {/* Nav 的 navbar：拓展開來會是navbar-nav */}
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <RouterNavLink to="/" className="nav-link">
                    Home
                  </RouterNavLink>
                </NavItem>
                {calendarLink}
              </Nav>
              <Nav navbar>
                <NavItem>
                  <NavLink
                    href="https://developer.microsoft.com/graph/docs/concepts/overview"
                    target="_blank"
                  >
                    <i className="fas fa-external-link-alt mr-1" />
                    Docs
                  </NavLink>
                </NavItem>
                <AuthNavItem
                  isAuthenticated={isAuthenticated}
                  authButtonMethod={authButtonMethod}
                  user={user}
                />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}
