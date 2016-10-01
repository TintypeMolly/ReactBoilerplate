import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, browserHistory} from "react-router";
import {syncHistoryWithStore, routerReducer} from "react-router-redux";
import {createStore, combineReducers} from "redux";

import ContextHolder from "./components/structures/ContextHolder";
import reducers from "./reducers";
import routes from "./routes";


// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  })
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

const findMetaTag = name => document.head.querySelector(`meta[name=${name}]`);

const contextHandler = {
  insertCss: (...styles) => {
    const removeCss = styles.map(style => style._insertCss());
    return () => removeCss.forEach(f => f());
  },
  setTitle: title => {
    const previousTitle = document.title;
    const ogTitle = findMetaTag("og:title");
    document.title = title;
    ogTitle.setAttribute("content", title);
    return () => {
      document.title = previousTitle;
      ogTitle.setAttribute("content", previousTitle);
    };
  },
  setDescription: description => {
    const descriptionEl = findMetaTag("description");
    const ogDescription = findMetaTag("og:description");
    const previousDescription = description.getAttribute("content");
    descriptionEl.setAttribute("content", description);
    ogDescription.setAttribute("content", description);
    return () => {
      descriptionEl.setAttribute("content", previousDescription);
      ogDescription.setAttribute("content", previousDescription);
    };
  },
};

const onRenderComplete = () => {
  const serverCss = document.getElementById("css");
  if (serverCss) {
    serverCss.parentNode.removeChild(serverCss);
  }
};

const appContainer = document.getElementById("app");

const render = routes => {
  ReactDOM.render(
    <ContextHolder contextHandler={contextHandler}>
      <Provider store={store}>
        <Router history={history} routes={routes}/>
      </Provider>
    </ContextHolder>,
    appContainer,
    onRenderComplete
  );
};

render(routes);

if (module.hot) {
  module.hot.accept("./routes", () => {
    const routes = require("./routes").default;
    render(routes);
  });
}
