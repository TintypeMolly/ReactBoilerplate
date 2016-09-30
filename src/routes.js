import React from "react";
import {Route, IndexRoute} from "react-router";

import App from "./components/structures/App";
import IndexPage from "./components/pages/IndexPage";
import NotFoundPage from "./components/pages/NotFoundPage";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IndexPage}/>
    <Route name="404" path="*" component={NotFoundPage}/>
  </Route>
);
