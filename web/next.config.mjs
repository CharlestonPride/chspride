/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'build',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    // Disable Turbopack for now due to Sass compatibility issues
    turbopack: false,
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
