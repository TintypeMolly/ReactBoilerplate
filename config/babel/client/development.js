import baseConfig from "../base";

export default {
  ...baseConfig,
  plugins: [
    "react-hot-loader/babel",
    ...baseConfig.plugins,
    ["react-transform", {
      transforms: [{
        transform: "react-transform-hmr",
        imports: ["react"],
        locals: ["module"],
      }, {
        transform: "react-transform-catch-errors",
        imports: ["react", "redbox-react"],
      }],
    }],
  ],
};
