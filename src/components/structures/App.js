import React, {PropTypes, Component} from "react";
import normalize from "normalize.css/normalize.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello, World!</h1>
        <p>this is a boiler plate</p>
        {this.props.children}
      </div>
    );
  }

  static contextTypes = {
    setMeta: PropTypes.func,
  };

  componentWillMount() {
    this.removeMeta = this.context.setMeta("og:image", "/android-chrome-512x512.png");
  }

  componentWillUnmount() {
    this.removeMeta();
  }
}


export default withStyles(normalize)(App);
