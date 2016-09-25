import {Component, PropTypes, Children} from "react";

const contextShape = {
  insertCss: PropTypes.func,
  setTitle: PropTypes.func,
};

class ContextHolder extends Component {
  static propTypes = {
    contextHandler: PropTypes.shape(contextShape).isRequired,
  };

  static childContextTypes = contextShape;

  getChildContext() {
    return {
      insertCss: this.props.contextHandler.insertCss,
      setTitle: this.props.contextHandler.setTitle,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default ContextHolder;
