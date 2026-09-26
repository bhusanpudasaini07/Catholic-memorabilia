/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wfdubfpmfwilfaxxvatx.storage.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.uat.ordering-iamthegardener-v4.ekbana.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.uat.ordering-iamthegardener-v4.ekbana.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.qa.ordering-iamthegardener-v4.ekbana.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qa.ordering-iamthegardener.ekbana.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.uat.ordering-merokishan.ekbana.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.iamthegardener.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uat.ordering-iamthegardener-v5.ekbana.net',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
}

module.exports = nextConfig
      "https://wfdubfpmfwilfaxxvatx.storage.supabase.co/",
      "https://wfdubfpmfwilfaxxvatx.storage.supabase.co/"