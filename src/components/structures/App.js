import React, {Component} from "react";
import normalize from "normalize.css/normalize.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";

const App = props => (
  <div>
    <h1>Hello, World!</h1>
    <p>this is a boiler plate</p>
    {props.children}
  </div>
);

export default withStyles(normalize)(App);
