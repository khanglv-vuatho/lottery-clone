const withNextIntl = require('next-intl/plugin')();

module.exports = withNextIntl({
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'vuatho.com' },
      { protocol: 'https', hostname: 'cdn.vuatho.com' },
      { protocol: 'https', hostname: 'icdn.vuatho.com' },
      { protocol: 'https', hostname: 'api.vuatho.com' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'sandbox-api-cms.vuatho.com' },
      { protocol: 'http', hostname: '192.168.1.72' },
    ],
  },
});
