/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.shopify.com',
				pathname: '/**',
			},
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						svgoConfig: {
							plugins: [
								{
									name: 'preset-default',
									params: {
										overrides: {
											removeViewBox: false, // keep viewBox so CSS scaling still works
										},
									},
								},
								'removeDimensions', // strips hardcoded width/height so className controls size
							],
						},
					},
				},
			],
		});
		return config;
	},
};

export default nextConfig;
