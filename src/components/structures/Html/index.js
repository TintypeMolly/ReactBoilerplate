import React from "react";

import favicon from "./favicon";

const Html = props => (
  <html>
  <head>
    <title>{props.title}</title>
    <meta charSet="utf-8"/>
    {favicon}
    {props.style && <style id="css" dangerouslySetInnerHTML={{__html: props.style}}/>}
  </head>
  <body>
  <div id="app" dangerouslySetInnerHTML={{__html: props.content}}></div>
  {props.script && <script src={props.script}/>}
  </body>
  </html>
);

export default Html;
