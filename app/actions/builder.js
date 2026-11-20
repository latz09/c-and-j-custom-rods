'use server';

import { randomUUID } from 'node:crypto';
import { sanityClient } from '@/utils/cms/sanityConnection';
import { FETCH_BUILDER_SERIES_QUERY as Q } from '@/data/queries/builder/FETCH_BUILDER_SERIES_QUERY';
import { getBuilderProducts } from '@/utils/shopify/getBuilderProducts';
import { getBuildPrice } from '@/lib/builder/pricing';
import { validateBuild } from '@/lib/builder/validateBuild';
import { buildAttributes } from '@/lib/builder/buildAttributes';
import { emptyBuildConfig } from '@/lib/builder/constants';
import { fail, addLinesToCart } from '@/lib/cart/cartServer';

// Only these keys are read from the client. Anything else is dropped.
function cleanConfig(raw) {
	const base = emptyBuildConfig(String(raw?.seriesSlug || ''));
	const out = { ...base };
	for (const key of Object.keys(base)) {
		if (raw?.[key] !== undefined && raw[key] !== null) out[key] = raw[key];
	}
	if (out.length !== null) out.length = Number(out.length);
	out.stickerText = typeof out.stickerText === 'string' ? out.stickerText : '';
	return out;
}

/**
 * Adds a custom build to the cart as two lines that share a `_buildId`:
 *   1. Custom Rod Build variant for the series (SKU = series slug), price = base price.
 *   2. Build Options variant matching the add-on total (skipped when the add-on total is $0).
 *
 * The client sends only its picks. The catalog, pricing rules and every price are fetched fresh
 * here, so nothing the browser says about money is trusted. Returns { cart, error }.
 */
export async function addBuildToCart(rawConfig) {
	try {
		const config = cleanConfig(rawConfig);
		if (!config.seriesSlug) return fail('Choose a series first.');

		// Fresh catalog, rules and Shopify prices on every call.
		const [catalog, products] = await Promise.all([
			sanityClient.fetch(Q, { slug: config.seriesSlug }, { perspective: 'published', cache: 'no-store' }),
			getBuilderProducts({ fresh: true }),
		]);

		if (!catalog) return fail('This series is not available to build.');
		const { page, ...series } = catalog;
		const rules = page?.pricingRules;

		const result = validateBuild(config, series, rules);
		if (!result.valid) return fail(result.firstProblem || 'This build is not valid.');

		if (!products.ok) {
			console.error('addBuildToCart: builder helper products missing in Shopify.');
			return fail('Custom builds are unavailable right now. Please contact us.');
		}

		const baseVariant = products.base[series.slug];
		if (!baseVariant) {
			console.error(`addBuildToCart: no Custom Rod Build variant with SKU "${series.slug}".`);
			return fail('This series cannot be ordered yet. Please contact us.');
		}
		if (!baseVariant.availableForSale) return fail('This series is unavailable right now.');

		const price = getBuildPrice(config, series, rules, baseVariant.price);

		const buildId = randomUUID();
		const attributes = buildAttributes(config, series, buildId);

		const lines = [
			{ merchandiseId: baseVariant.variantId, quantity: 1, attributes },
		];

		if (price.addOnTotal > 0) {
			const optionsVariant = products.options[price.addOnTotal];
			if (!optionsVariant?.availableForSale) {
				console.error(`addBuildToCart: no Build Options variant for $${price.addOnTotal}.`);
				return fail('This combination cannot be ordered yet. Please contact us.');
			}
			lines.push({ merchandiseId: optionsVariant.variantId, quantity: 1, attributes });
		}

		return await addLinesToCart(lines);
	} catch (err) {
		console.error('addBuildToCart failed:', err);
		return fail('Could not add your build to the cart.');
	}
}
