/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en-US', 'zh-CN'],
    defaultLocale: 'en-US',
  },
    images: {
        remotePatterns: [
          {
            // protocol: 'https',
            hostname: 'ipfs.io',
            hostname: 'gateway.pinata.cloud',
            // pathname: '**',
          },
        ],
      },
};

export default nextConfig;
