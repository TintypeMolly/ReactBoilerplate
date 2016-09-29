import baseConfig from "../base";

export default {
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins,
    "transform-react-remove-prop-types",
    "transform-react-constant-elements",
    "transform-react-inline-elements",
  ],
};
