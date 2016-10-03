import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import React from "react";
import ReactDOM from "react-dom/server";
import {match, RouterContext} from "react-router";
import Minimize from "minimize";

import assets from "./assets"; // eslint-disable-line import/no-unresolved
import ContextHolder from "./components/structures/ContextHolder";
import Html from "./components/structures/Html";
import routes from "./routes";
import {PORT, DEFAULT_TITLE, DEFAULT_DESCRIPTION} from "./config";

const app = express();
const minimize = new Minimize();

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
      };
      const contentElement = (
        <ContextHolder contextHandler={contextHandler}>
          <RouterContext {...props}/>
        </ContextHolder>
      );
      let statusCode = 200;
      for (const r of contentElement.props.children.props.routes) {
        if (r.name === "404") {
          statusCode = 404;
          break;
        }
      }
      context.content = ReactDOM.renderToString(contentElement);
      const html = Html(context);
      res.status(statusCode);
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

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`); // eslint-disable-line no-console
});
