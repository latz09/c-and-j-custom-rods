import { urlFor } from './sanityConnection';

// Generate optimized image URL from Sanity image object
export function getSanityImageUrl(image, options = {}) {
	if (!image?.asset) return null;

	const {
		width = 1920,
		height,
		quality = 90,
		format = 'webp',
		fit = 'crop',
	} = options;

	let img = urlFor(image).width(width).quality(quality).format(format).fit(fit);
	if (height) img = img.height(height);

	return img.url();
}

// Get CSS object-position from Sanity hotspot data
export function getHotspotStyles(image) {
	if (!image?.hotspot) {
		return { objectPosition: 'center center' };
	}

	const { x, y } = image.hotspot;
	return {
		objectPosition: `${x * 100}% ${y * 100}%`,
	};
}

// Get responsive image URLs for different breakpoints
export function getResponsiveImageUrls(image, breakpoints = {}) {
	if (!image?.asset) return {};

	const defaultBreakpoints = {
		mobile: { width: 640, height: 360 },
		tablet: { width: 1024, height: 576 },
		desktop: { width: 1920, height: 1080 },
		...breakpoints,
	};

	const urls = {};

	Object.entries(defaultBreakpoints).forEach(([key, { width, height }]) => {
		urls[key] = getSanityImageUrl(image, { width, height });
	});

	return urls;
}

// Common image size presets for your site
export const IMAGE_PRESETS = {
	heroBackground: {
		width: 2560,
		quality: 80,
		format: 'webp',
		fit: 'max',
	},
	heroForeground: {
		width: 1400,
		height: 1400, // matches source 2140x2140 aspect; object-contain in your className handles final framing
		quality: 90,
		format: 'webp',
		fit: 'max',
	},
	aboutBlurb: {
		width: 1600,
		height: 649, // matches source 1280x519 aspect ratio (~2.47:1)
		quality: 90,
		format: 'webp',
		fit: 'max',
	},
	ourStoryPhoto: {
		width: 810,
		height: 890, // 81:89 aspect ratio
		quality: 90,
		format: 'webp',
		fit: 'max',
	},
	reviewPhoto: {
		width: 822, // 2x lg display width (411px) for retina sharpness
		height: 974, // 2x lg display height (487px), matches source 91:108 ratio
		quality: 90,
		format: 'webp',
		fit: 'crop',
	},
	inStockRodHero: {
		width: 1200,
		height: 1044, // matches source 646x562 aspect ratio
		quality: 90,
		format: 'webp',
		fit: 'max',
	},
	rodSeriesCard: {
		width: 315,
		height: 315,
		quality: 90,
		format: 'webp',
		fit: 'max',
	},
	rodSeriesHero: {
		width: 408,
		height: 492,
		quality: 90,
		format: 'webp',
		fit: 'max',
	},
};
