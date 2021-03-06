import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import React from "react";
import {Provider} from "react-redux";
import ReactDOM from "react-dom/server";
import {match, RouterContext} from "react-router";
import {routerReducer} from "react-router-redux";
import {createStore, combineReducers} from "redux";
import Minimize from "minimize";
import http from "http";

import assets from "./assets"; // eslint-disable-line import/no-unresolved
import ContextHolder from "./components/structures/ContextHolder";
import Html from "./components/structures/Html";
import routes from "./routes";
import {PORT, DEFAULT_TITLE, DEFAULT_DESCRIPTION} from "./config";
import reducers from "./reducers";

const app = express();
const minimize = new Minimize();

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  })
);

app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

app.get("*", (req, res, next) => {
  match({routes: routes, location: req.url}, (err, redirect, props) => {
    if (err) {
      next(err);
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      const context = {
        css: new Set(),
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        content: undefined,
        script: assets.main.js,
        metaContext: {},
        preloadedState: undefined,
        status: 200,
      };
      const contextHandler = {
        insertCss: (...styles) => styles.forEach(style => context.css.add(style._getCss())),
        setTitle: title => {
          context.title = title;
        },
        setDescription: description => {
          context.description = description;
        },
        setMeta: (name, content) => {
          context.metaContext[name] = content;
        },
        setStatus: status => {
          context.status = status;
        },
      };
      const contentElement = (
        <ContextHolder contextHandler={contextHandler}>
          <Provider store={store}>
            <RouterContext {...props}/>
          </Provider>
        </ContextHolder>
      );
      context.content = ReactDOM.renderToString(contentElement);
      context.preloadedState = store.getState();
      const html = Html(context);
      res.status(context.status);
      res.send(minimize.parse(html));
    } else {
      // won't happen
    }
  });
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err); // eslint-disable-line no-console
  res.status(err.status || 500);
  if (process.env.NODE_ENV === "development") {
    // TODO pretty debug info
    res.send(err);
  } else {
    // TODO internal server error page
    res.send("error");
  }
});

const server = http.createServer(app);

if (require.main === module) {
  console.log(`listening on port http://localhost:${PORT}`); // eslint-disable-line no-console
  server.listen(PORT);
}

export default app;
