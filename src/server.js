import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import React from "react";
import ReactDOM from "react-dom/server";
import {match, RouterContext} from "react-router";

import assets from "./assets"; // eslint-disable-line import/no-unresolved
import ContextHolder from "./components/ContextHolder";
import Html from "./components/Html";
import routes from "./routes";
import {PORT, DEFAULT_TITLE} from "./config";

const app = express();

app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

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
      };
      const contextHandler = {
        insertCss: (...styles) => styles.forEach(style => context.css.add(style._getCss())),
        setTitle: title => {
          context.title = title;
        },
      };
      const content = ReactDOM.renderToString(
        <ContextHolder contextHandler={contextHandler}>
          <RouterContext {...props}/>
        </ContextHolder>
      );
      const html = ReactDOM.renderToStaticMarkup(
        <Html
          title={context.title}
          content={content}
          style={[...context.css].join("")}
          script={assets.main.js}
        />
      );
      res.status(200);
      res.send(`<!DOCTYPE html>${html}`);
    } else {
      // TODO
      const errorNotFound = new Error("Page Not Found");
      errorNotFound.status = 404;
      next();
    }
  });
});

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
                                   // TODO
  console.error(err); // eslint-disable-line no-console
  res.status(err.status || 500);
  res.send("error");
});

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`); // eslint-disable-line no-console
});
