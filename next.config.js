/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['swiper'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wfdubfpmfwilfaxxvatx.storage.supabase.co',
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