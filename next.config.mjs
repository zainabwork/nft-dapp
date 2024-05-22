/** @type {import('next').NextConfig} */
const nextConfig = {
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
