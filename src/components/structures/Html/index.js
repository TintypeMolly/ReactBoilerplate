import favicon from "./favicon.json";

const Html = ({title, css, content, script, description, metaContext, preloadedState}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${title ? `<meta name="og:title" content="${title}" />` : ""}
    ${css && css.size > 0 ? `<style id="css">${[...css].join("")}</style>` : ""}
    ${description ? `<meta name="description" content="${description}" />` : ""}
    ${description ? `<meta name="og:description" content="${description}" />` : ""}
    ${metaContext ? Object.keys(metaContext).map(name => `<meta name="${name}" content="${metaContext[name]}" data-create="server"/>`).join("") : ""}
    ${favicon.join("")}
  </head>
  <body>
    <div id="app">${content}</div>
    ${preloadedState ? `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)};</script>` : ""}
    ${script ? `<script src="${script}"></script>` : ""}
  </body>
</html>
`;

export default Html;
