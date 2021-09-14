// module.exports = {
//   reactStrictMode: true,
// }

export async function rewrites() {
  [
    {
      destination: 'http://localhost:5000/:path*',
      source: '/:path*',
    },
  ];
}