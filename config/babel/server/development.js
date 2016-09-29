import baseConfig from "../base";

export default {
  ...baseConfig,
  plugins: [
    "react-hot-loader/babel",
    ...baseConfig.plugins,
  ],
};

