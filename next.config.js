// module.exports = {
//   reactStrictMode: true,
// }

module.exports = {
  async rewrites() {
    return [
      {
        destination: 'http://localhost:5000/:path*',
        source: '/:path*',
      },
  ];
  },
}