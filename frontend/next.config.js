module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
    });
    return config;
  },
};
