// module.exports = {
//   reactStrictMode: true,
// }

module.exports = {
  async rewrites() {
    [
      {
        destination: 'http://localhost:5000/:path*',
        source: '/:path*',
      },
  ];
  },
}