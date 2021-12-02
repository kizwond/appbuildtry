// module.exports = {
//   reactStrictMode: true,
// }
var webpack = require("webpack");

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_ACCESS_URI}/api/:path*`,
      },
    ];
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["react", "es2015", "stage-2"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=application/octet-stream",
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: "file-loader",
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=image/svg+xml",
      },
    ],
  },
  resolve: {
    modules: ["node_modules"],
  },
  reactStrictMode: true,
};

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.jsx$/,
//         use: {
//           loader: "babel-loader",
//           options: {
//             cacheDirectory: true,
//             presets: ["react", "es2015", "stage-2"],
//           },
//         },
//       },
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader"],
//       },
//       {
//         test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
//         use: "url-loader?limit=10000&mimetype=application/font-woff",
//       },
//       {
//         test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
//         use: "url-loader?limit=10000&mimetype=application/font-woff",
//       },
//       {
//         test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
//         use: "url-loader?limit=10000&mimetype=application/octet-stream",
//       },
//       {
//         test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
//         use: "file-loader",
//       },
//       {
//         test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
//         use: "url-loader?limit=10000&mimetype=image/svg+xml",
//       },
//     ],
//   },
//   resolve: {
//     modules: ["node_modules"],
//   },
// };
