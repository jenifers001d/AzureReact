import React from "react";
import { Alert } from "reactstrap";

export default class ErrorMessage extends React.Component {
  render() {
    let des = null;
    if (this.props.des) {
      des = (
        <pre className="alert-pre border bg-light p-2">
          <code>{this.props.des}</code>
        </pre>
      );
    }
    return (
      <Alert color="danger">
        <p className="mb-3">{this.props.msg}</p>
        {des}
      </Alert>
    );
  }
}
