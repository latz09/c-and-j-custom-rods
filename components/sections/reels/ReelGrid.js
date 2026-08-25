import ReelCard from "./ReelCard";

export default function ReelGrid({
	products,
	excludeHandle,
	className = 'grid grid-cols-2 lg:grid-cols-4 gap-2 py-2.25',
}) {
	const visibleProducts = excludeHandle
		? products.filter((p) => p.handle !== excludeHandle)
		: products;

	if (visibleProducts.length === 0) return null;

	return (
		<section className={className}>
			{visibleProducts.map((product, index) => (
				<ReelCard key={product.id} product={product} index={index} />
			))}
		</section>
	);
}