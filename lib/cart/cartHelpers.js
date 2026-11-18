export function formatMoney({ amount, currencyCode } = {}) {
	if (amount === undefined) return '';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currencyCode || 'USD',
	}).format(Number(amount));
}

// Attributes starting with "_" are hidden from customers (e.g. _buildId).
export const visibleAttributes = (attributes = []) =>
	attributes.filter((a) => !a.key.startsWith('_') && a.value);

// Reels and apparel are collections; rods are everything else (tag-based).
// Returns null for helper products (e.g. tagged `builder`) that have no page.
export function getProductUrl(product) {
	if (!product?.handle) return null;
	if (product.tags?.includes('builder')) return null;
	const collections = product.collections?.nodes?.map((c) => c.handle) || [];
	if (collections.includes('reels')) return `/shop/reels/${product.handle}`;
	if (collections.includes('apparel')) return `/shop/apparel/${product.handle}`;
	return `/shop/rods/${product.handle}`;
}

/**
 * Groups cart lines. Lines sharing a `_buildId` attribute form one group
 * (a custom rod build: base line + options line). Every other line is its own
 * group. Phase 7 renders multi-line groups as one build item.
 */
export function groupCartLines(lines = []) {
	const groups = [];
	const byBuild = new Map();

	for (const line of lines) {
		const buildId = line.attributes?.find((a) => a.key === '_buildId')?.value;
		if (!buildId) {
			groups.push({ key: line.id, buildId: null, lines: [line] });
			continue;
		}
		let group = byBuild.get(buildId);
		if (!group) {
			group = { key: buildId, buildId, lines: [] };
			byBuild.set(buildId, group);
			groups.push(group);
		}
		group.lines.push(line);
	}
	return groups;
}
