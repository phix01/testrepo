import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
   images: {
    domains: ["bulbi-public.s3.eu-west-1.amazonaws.com"],
  },
};

export default withNextIntl(nextConfig);