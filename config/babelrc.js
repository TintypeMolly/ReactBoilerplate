const productionPlugins = [
  "transform-react-remove-prop-types",
  "transform-react-constant-elements",
  "transform-react-inline-elements",
];

const developmentPlugins = [
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
];


export default isProduction => {
  const plugins = isProduction ? productionPlugins : developmentPlugins;
  return {
    plugins: [
      "transform-runtime",
      ...plugins,
    ],
    presets: [
      "latest",
      "react",
      "stage-0",
    ],
  };
};
