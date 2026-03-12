import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
   images: {
    domains: ["bulbi-public.s3.eu-west-1.amazonaws.com"],
  },
  async headers() {
    return [
      {
        source: '/tr/event/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=30, stale-while-revalidate=60',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);