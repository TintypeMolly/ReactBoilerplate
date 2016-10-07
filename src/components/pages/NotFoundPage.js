import React, {Component, PropTypes} from "react";

class NotFoundPage extends Component {
  static contextTypes = {
    setStatus: PropTypes.func,
  };

  componentWillMount() {
    this.context.setStatus(400);
  }

  render() {
    return (
      <div>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist :(</p>
      </div>
    );
  }
}

export default NotFoundPage;
