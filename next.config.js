const withStyle9 = require("style9-webpack/next-appdir");

module.exports = withStyle9({
  parserOptions: {
    presets: [
      "@babel/react",
      "@babel/typescript",
      [
        "@babel/env",
        {
          modules: false,
        },
      ],
    ],
    plugins: ["typescript", "jsx"],
  }, // // {import('@babel/core').ParserOptions} optional, default is `{ plugins: ['typescript', 'jsx'] }`
  minifyProperties: process.env.NODE_ENV === "production", // {boolean?} optional, default is false, recommended to enable this option in production
  incrementalClassnames: false, // {boolean?} optional, default is false
})({
  reactStrictMode: true,
  // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  transpilePackages: ["style9"],
});
