import React from "react";
import PropTypes from "prop-types";

class Display extends React.Component {
  render() {
    return (
      <div className="com-display">
        <div>{this.props.value}</div>
      </div>
    );
  }
}
Display.propTypes = {
  value: PropTypes.string,
};
export default Display;