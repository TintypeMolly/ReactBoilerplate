import favicon from "./favicon.json";

const Html = ({title, css, content, script}) => `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8"/>
    ${favicon.join("")}
    ${css && css.size > 0 ? `<style id="css">${[...css].join("")}</style>` : ""}
  </head>
  <body>
    <div id="app">${content}</div>
    ${script ? `<script src="${script}"></script>` : ""}
  </body>
</html>
`;

export default Html;
