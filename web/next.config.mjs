/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    sassOptions: {
        includePaths: ['./node_modules'],
        silenceDeprecations: [
            'legacy-js-api',
            'import',
            'color-functions',
            'global-builtin',
            'if-function',
            'function-units'
        ],
    }
};

export default nextConfig;
