import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Enforce TypeScript checking during builds
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enforce ESLint checking during builds
    ignoreDuringBuilds: false,
    // Configure directories to lint
    dirs: ['src', 'pages', 'components', 'lib', 'utils'],
  },
  // Enable standalone output for Docker production builds (skip if NEXT_SKIP_STANDALONE is set)
  ...(process.env.NEXT_SKIP_STANDALONE !== 'true' && { output: 'standalone' }),
  // Experimental configuration for better server component handling
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
