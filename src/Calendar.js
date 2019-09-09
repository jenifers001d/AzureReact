import React from "react";
import { Table } from "reactstrap";
import moment from "moment";
import config from "./Config";
import { getCalenderEvents } from "./GraphService";

// Helper function to format Graph date/time
function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format("D/M/YY h:mm A");
}

export default class Calendar extends React.Component {
  state = {
    events: [],
  };

  async componentDidMount() {
    try {
      // Get the user's access token
      let accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes,
      });
      // Get the user's events
      var events = await getCalenderEvents(accessToken);
      console.log(events);
      // Update the array of events in state
      this.setState({ events: events.value });
    } catch (err) {
      this.props.showError("ERROR", JSON.stringify(err));
    }
  }

  render() {
    return (
      <div>
        <h1>Calendar</h1>
        <Table>
          <thead>
            <tr>
              <th scope="col">Organizer</th>
              <th scope="col">Subject</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
            </tr>
          </thead>
          <tbody>
            {this.state.events.map(function(event) {
              return (
                <tr key={event.id}>
                  <td>{event.organizer.emailAddress.name}</td>
                  <td>{event.subject}</td>
                  <td>{formatDateTime(event.start.dateTime)}</td>
                  <td>{formatDateTime(event.end.dateTime)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
